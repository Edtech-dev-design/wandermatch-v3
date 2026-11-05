-- ============================================================================
-- WANDERMATCH V4.0 – MIGRATION 001: COMPLETE 27-TABLE NORMALIZED SCHEMA & TRIGGERS
-- Specification: WANDERMATCH_V4_PHASE_2_2_FINAL.md
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SCHEMA PRIVILEGE HARDENING (PREVENT OBJECT SHADOWING IN PUBLIC SCHEMA)
-- ============================================================================
REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ============================================================================
-- 2. HELPER FUNCTIONS FOR RLS & IMMUTABLE AUDIT PROTECTION
-- (All SECURITY DEFINER functions strictly use SET search_path = pg_catalog, public)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(p_uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_uid
      AND role IN ('admin', 'super_admin')
      AND is_active = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(p_uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_uid
      AND role = 'super_admin'
      AND is_active = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.prevent_immutable_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  RAISE EXCEPTION 'Table % is append-only immutable; UPDATE and DELETE are prohibited.', TG_TABLE_NAME
    USING ERRCODE = '42501';
END;
$$;

-- ============================================================================
-- DOMAIN 1: IDENTITY, PII VAULT & RBAC (TABLES #1 - #4)
-- ============================================================================

-- TABLE #1: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL CHECK (length(trim(full_name)) >= 2),
    phone VARCHAR(20),
    avatar_url TEXT,
    loyalty_tier VARCHAR(20) NOT NULL DEFAULT 'BRONZE'
        CHECK (loyalty_tier IN ('BRONZE', 'SILVER', 'GOLD')),
    loyalty_points INT NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON public.profiles(loyalty_tier);

-- TABLE #2: user_sensitive_pii (Isolated Vault — Zero Direct Client Access)
CREATE TABLE IF NOT EXISTS public.user_sensitive_pii (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    cccd_ciphertext TEXT NOT NULL,
    cccd_key_version SMALLINT NOT NULL DEFAULT 1 CHECK (cccd_key_version >= 1),
    cccd_blind_index VARCHAR(64) UNIQUE NOT NULL,
    cccd_last4 CHAR(4) NOT NULL CHECK (cccd_last4 ~ '^[0-9]{4}$'),
    refund_bank_code VARCHAR(20) NOT NULL,
    refund_bank_account_ciphertext TEXT NOT NULL,
    refund_bank_account_last4 VARCHAR(4) NOT NULL CHECK (refund_bank_account_last4 ~ '^[0-9]{4}$'),
    refund_bank_holder_normalized VARCHAR(120) NOT NULL,
    bank_key_version SMALLINT NOT NULL DEFAULT 1 CHECK (bank_key_version >= 1),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pii_blind_index ON public.user_sensitive_pii(cccd_blind_index);
CREATE INDEX IF NOT EXISTS idx_pii_key_version ON public.user_sensitive_pii(cccd_key_version, bank_key_version);

-- TABLE #3: user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL
        CHECK (role IN ('traveler', 'b2b_partner', 'admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_roles_pair UNIQUE (user_id, role)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_active ON public.user_roles(user_id, is_active);

-- TABLE #4: user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    healing_pref SMALLINT NOT NULL DEFAULT 75 CHECK (healing_pref BETWEEN 0 AND 100),
    nature_pref SMALLINT NOT NULL DEFAULT 75 CHECK (nature_pref BETWEEN 0 AND 100),
    solitude_pref SMALLINT NOT NULL DEFAULT 75 CHECK (solitude_pref BETWEEN 0 AND 100),
    comfort_pref SMALLINT NOT NULL DEFAULT 75 CHECK (comfort_pref BETWEEN 0 AND 100),
    culture_pref SMALLINT NOT NULL DEFAULT 75 CHECK (culture_pref BETWEEN 0 AND 100),
    comfort_locks JSONB NOT NULL DEFAULT '{"no_red_eye": true, "min_stars": 4, "baggage_kg": 20}'::jsonb,
    default_blacklisted_slugs TEXT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- DOMAIN 2: TRAVEL INVENTORY & B2B PARTNERS (TABLES #5 - #9)
-- ============================================================================

-- TABLE #5: destinations
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_slug VARCHAR(50) UNIQUE NOT NULL,
    city_name VARCHAR(80) NOT NULL,
    province_name VARCHAR(80) NOT NULL,
    region VARCHAR(30) NOT NULL
        CHECK (region IN ('NORTH', 'CENTRAL', 'SOUTH', 'HIGHLANDS', 'ISLAND')),
    climate_bucket_id VARCHAR(40) NOT NULL
        CHECK (climate_bucket_id IN ('COOL_MIST_HIGHLAND', 'TROPICAL_COAST_SUN', 'HERITAGE_CULTURAL_WARM')),
    climate_zone_label VARCHAR(80) NOT NULL,
    temp_range_label VARCHAR(40) NOT NULL,
    healing_score SMALLINT NOT NULL CHECK (healing_score BETWEEN 0 AND 100),
    nature_score SMALLINT NOT NULL CHECK (nature_score BETWEEN 0 AND 100),
    solitude_score SMALLINT NOT NULL CHECK (solitude_score BETWEEN 0 AND 100),
    comfort_score SMALLINT NOT NULL CHECK (comfort_score BETWEEN 0 AND 100),
    culture_score SMALLINT NOT NULL CHECK (culture_score BETWEEN 0 AND 100),
    climate_profile_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    approved_mystery_hints_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    generic_packing_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    local_dining_guide_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dest_region_active ON public.destinations(region, is_active);
CREATE INDEX IF NOT EXISTS idx_dest_climate_bucket ON public.destinations(climate_bucket_id);

-- TABLE #6: travel_providers
CREATE TABLE IF NOT EXISTS public.travel_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    provider_name VARCHAR(150) NOT NULL,
    provider_type VARCHAR(30) NOT NULL
        CHECK (provider_type IN ('HOTEL', 'AIRLINE', 'COMBO_OPERATOR')),
    business_license_no VARCHAR(60) UNIQUE NOT NULL,
    kyb_status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (kyb_status IN ('PENDING', 'VERIFIED', 'SUSPENDED')),
    settlement_bank_code VARCHAR(20) NOT NULL,
    settlement_bank_account VARCHAR(40) NOT NULL,
    settlement_bank_holder VARCHAR(120) NOT NULL,
    sla_deposit_vnd BIGINT NOT NULL DEFAULT 50000000 CHECK (sla_deposit_vnd >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_providers_owner ON public.travel_providers(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_providers_kyb ON public.travel_providers(kyb_status, is_active);

-- TABLE #7: hotels
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES public.travel_providers(id) ON DELETE RESTRICT,
    hotel_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    sla_code VARCHAR(50) UNIQUE NOT NULL,
    star_rating SMALLINT NOT NULL CHECK (star_rating BETWEEN 3 AND 5),
    review_score NUMERIC(3,1) NOT NULL DEFAULT 9.0 CHECK (review_score BETWEEN 1.0 AND 10.0),
    vibe_tier_alias VARCHAR(80) NOT NULL DEFAULT 'Boutique Sanctuary & Spa',
    secret_hero_image_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hotels_dest ON public.hotels(destination_id, is_active);
CREATE INDEX IF NOT EXISTS idx_hotels_provider ON public.hotels(provider_id);

-- TABLE #8: flights
CREATE TABLE IF NOT EXISTS public.flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES public.travel_providers(id) ON DELETE RESTRICT,
    origin_airport VARCHAR(10) NOT NULL CHECK (origin_airport IN ('SGN', 'HAN', 'DAD')),
    destination_airport VARCHAR(10) NOT NULL,
    airline_name VARCHAR(80) NOT NULL,
    flight_code VARCHAR(20) NOT NULL,
    exact_departure_time VARCHAR(40) NOT NULL,
    time_band VARCHAR(20) NOT NULL
        CHECK (time_band IN ('MORNING', 'MIDDAY', 'AFTERNOON', 'EVENING')),
    baggage_kg SMALLINT NOT NULL DEFAULT 20 CHECK (baggage_kg >= 0),
    is_red_eye BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_flights_code_origin UNIQUE (flight_code, origin_airport)
);
CREATE INDEX IF NOT EXISTS idx_flights_origin_dest ON public.flights(origin_airport, destination_id, is_active);
CREATE INDEX IF NOT EXISTS idx_flights_band ON public.flights(time_band);

-- TABLE #9: partner_inventories
CREATE TABLE IF NOT EXISTS public.partner_inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.travel_providers(id) ON DELETE RESTRICT,
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES public.flights(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('HOTEL_ROOM', 'FLIGHT_SEAT')),
    inventory_date DATE NOT NULL,
    total_slots INT NOT NULL CHECK (total_slots >= 0),
    available_slots INT NOT NULL CHECK (available_slots >= 0),
    reserved_slots INT NOT NULL DEFAULT 0 CHECK (reserved_slots >= 0),
    retail_price_vnd BIGINT NOT NULL CHECK (retail_price_vnd > 0),
    net_price_vnd BIGINT NOT NULL CHECK (net_price_vnd > 0 AND retail_price_vnd >= net_price_vnd),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_inv_item_xor CHECK (
        (item_type = 'HOTEL_ROOM' AND hotel_id IS NOT NULL AND flight_id IS NULL) OR
        (item_type = 'FLIGHT_SEAT' AND flight_id IS NOT NULL AND hotel_id IS NULL)
    ),
    CONSTRAINT chk_inv_slots_balance CHECK (available_slots + reserved_slots <= total_slots)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_inv_hotel_date ON public.partner_inventories(hotel_id, inventory_date) WHERE hotel_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_inv_flight_date ON public.partner_inventories(flight_id, inventory_date) WHERE flight_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inv_date_type_avail ON public.partner_inventories(inventory_date, item_type, available_slots) WHERE is_active = TRUE;

-- ============================================================================
-- DOMAIN 3: AI RECOMMENDATION & SEALED PACKAGES (TABLES #10 - #12)
-- ============================================================================

-- TABLE #10: recommendation_sessions
CREATE TABLE IF NOT EXISTS public.recommendation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    origin_airport VARCHAR(10) NOT NULL CHECK (origin_airport IN ('SGN', 'HAN', 'DAD')),
    budget_per_person_vnd BIGINT NOT NULL CHECK (budget_per_person_vnd >= 1000000),
    group_size SMALLINT NOT NULL CHECK (group_size BETWEEN 1 AND 20),
    departure_date DATE NOT NULL,
    duration_days SMALLINT NOT NULL DEFAULT 3 CHECK (duration_days BETWEEN 1 AND 14),
    trip_purpose VARCHAR(60) NOT NULL DEFAULT 'GENERAL_RETREAT',
    vec_healing SMALLINT NOT NULL CHECK (vec_healing BETWEEN 0 AND 100),
    vec_nature SMALLINT NOT NULL CHECK (vec_nature BETWEEN 0 AND 100),
    vec_solitude SMALLINT NOT NULL CHECK (vec_solitude BETWEEN 0 AND 100),
    vec_comfort SMALLINT NOT NULL CHECK (vec_comfort BETWEEN 0 AND 100),
    vec_culture SMALLINT NOT NULL CHECK (vec_culture BETWEEN 0 AND 100),
    blacklisted_city_slugs TEXT[] NOT NULL DEFAULT '{}',
    comfort_locks JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_archetype_label VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_rec_sessions_id_user UNIQUE (id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_rec_sess_user_time ON public.recommendation_sessions(user_id, created_at DESC);

-- TABLE #11: packages (Composite FK to recommendation_sessions & k_anonymity_count >= 3)
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rank_order SMALLINT NOT NULL CHECK (rank_order BETWEEN 1 AND 5),
    is_top_pick BOOLEAN NOT NULL DEFAULT FALSE,
    -- SECRET COLUMNS (HIDDEN FROM CLIENT PRE-REVEAL)
    secret_destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE RESTRICT,
    secret_hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE RESTRICT,
    secret_flight_id UUID NOT NULL REFERENCES public.flights(id) ON DELETE RESTRICT,
    -- SAFE ANONYMIZED TEASER COLUMNS (K-ANONYMITY >= 3)
    blind_code_alias VARCHAR(40) NOT NULL,
    climate_bucket_id VARCHAR(40) NOT NULL,
    climate_zone_label VARCHAR(80) NOT NULL,
    temp_range_label VARCHAR(40) NOT NULL,
    anonymized_hint TEXT NOT NULL,
    packing_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    hotel_star_tier SMALLINT NOT NULL CHECK (hotel_star_tier BETWEEN 3 AND 5),
    vibe_tier_alias VARCHAR(80) NOT NULL,
    flight_time_band VARCHAR(40) NOT NULL,
    mood_illustration_key VARCHAR(40) NOT NULL,
    display_price_band_vnd VARCHAR(60) NOT NULL DEFAULT '5.000.000đ - 5.500.000đ',
    k_anonymity_count SMALLINT NOT NULL DEFAULT 3 CHECK (k_anonymity_count >= 3),
    -- INTENTIONAL POINT-IN-TIME SNAPSHOT PRICING (FLAT TIERED BLIND PRICING)
    group_size SMALLINT NOT NULL CHECK (group_size BETWEEN 1 AND 20),
    unit_price_vnd BIGINT NOT NULL CHECK (unit_price_vnd > 0),
    expected_amount_vnd BIGINT NOT NULL CHECK (expected_amount_vnd = unit_price_vnd * group_size),
    retail_value_vnd BIGINT NOT NULL CHECK (retail_value_vnd >= expected_amount_vnd),
    net_cost_vnd BIGINT NOT NULL CHECK (net_cost_vnd > 0 AND net_cost_vnd <= expected_amount_vnd),
    similarity_score NUMERIC(5,2) NOT NULL CHECK (similarity_score BETWEEN 0 AND 100),
    total_score NUMERIC(5,2) NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    score_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'SEALED_ACTIVE'
        CHECK (status IN ('SEALED_ACTIVE', 'LOCKED_IN_BOOKING', 'EXPIRED')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pkg_session_rank UNIQUE (session_id, rank_order),
    CONSTRAINT uq_packages_id_user UNIQUE (id, user_id),
    CONSTRAINT fk_packages_session_user
        FOREIGN KEY (session_id, user_id)
        REFERENCES public.recommendation_sessions(id, user_id)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pkg_user_status ON public.packages(user_id, status);
CREATE INDEX IF NOT EXISTS idx_pkg_session ON public.packages(session_id);
CREATE INDEX IF NOT EXISTS idx_pkg_expires ON public.packages(expires_at) WHERE status = 'SEALED_ACTIVE';

-- TABLE #12: package_items
CREATE TABLE IF NOT EXISTS public.package_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.partner_inventories(id) ON DELETE RESTRICT,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('HOTEL_ROOM', 'FLIGHT_SEAT')),
    units_required SMALLINT NOT NULL CHECK (units_required > 0),
    unit_snapshot_price_vnd BIGINT NOT NULL CHECK (unit_snapshot_price_vnd >= 0),
    CONSTRAINT uq_pkg_item_inv UNIQUE (package_id, inventory_id)
);
CREATE INDEX IF NOT EXISTS idx_pkg_items_pkg ON public.package_items(package_id);

-- ============================================================================
-- DOMAIN 4: BOOKING, TRAVELERS & INVENTORY HOLDS (TABLES #13 - #17)
-- ============================================================================

-- TABLE #13: bookings (Composite FK to packages & Legacy Booking Code Compatibility)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(24) UNIQUE NOT NULL CHECK (booking_code ~ '^WM(-?[A-Z0-9]{4,16})+$'),
    is_legacy_migrated BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    package_id UUID UNIQUE NOT NULL,
    group_size SMALLINT NOT NULL CHECK (group_size BETWEEN 1 AND 20),
    expected_amount_vnd BIGINT NOT NULL CHECK (expected_amount_vnd > 0),
    paid_amount_vnd BIGINT NOT NULL DEFAULT 0 CHECK (paid_amount_vnd >= 0),
    amount_due_vnd BIGINT GENERATED ALWAYS AS (GREATEST(0, expected_amount_vnd - paid_amount_vnd)) STORED,
    overpaid_amount_vnd BIGINT GENERATED ALWAYS AS (GREATEST(0, paid_amount_vnd - expected_amount_vnd)) STORED,
    status VARCHAR(35) NOT NULL DEFAULT 'PENDING_PAYMENT'
        CHECK (status IN (
            'PENDING_PAYMENT',
            'UNDERPAID',
            'PAID',
            'OVERPAID',
            'PAID_HOLD_CONFLICT',
            'REVEALED',
            'COMPLETED',
            'REFUND_REQUESTED',
            'REFUND_APPROVED',
            'REFUND_PROCESSING',
            'REFUND_RECONCILIATION_REQUIRED',
            'REFUNDED',
            'EXPIRED',
            'CANCELLED'
        )),
    is_revealed BOOLEAN NOT NULL DEFAULT FALSE,
    revealed_at TIMESTAMPTZ,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL CHECK (return_date >= departure_date),
    hold_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_bookings_package_user
        FOREIGN KEY (package_id, user_id)
        REFERENCES public.packages(id, user_id)
        ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_bookings_user_created ON public.bookings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status_exp ON public.bookings(status, hold_expires_at);

-- Trigger enforcing strict ^WM[0-9]{8}$ on all new V4 bookings while allowing legacy migrated codes
CREATE OR REPLACE FUNCTION public.enforce_booking_code_format_v4()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
    IF NEW.is_legacy_migrated = FALSE AND NEW.booking_code !~ '^WM[0-9]{8}$' THEN
        RAISE EXCEPTION 'INVALID_BOOKING_CODE: New V4 bookings must match ^WM[0-9]{8}$ (got %).', NEW.booking_code
            USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_booking_code_format ON public.bookings;
CREATE TRIGGER trg_enforce_booking_code_format
BEFORE INSERT OR UPDATE OF booking_code, is_legacy_migrated ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_code_format_v4();

-- Trigger enforcing Booking State Transition Matrix
CREATE OR REPLACE FUNCTION public.enforce_booking_state_transition_v4()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    IF NOT (
        (OLD.status = 'PENDING_PAYMENT' AND NEW.status IN ('UNDERPAID', 'PAID', 'OVERPAID', 'EXPIRED', 'CANCELLED')) OR
        (OLD.status = 'UNDERPAID' AND NEW.status IN ('PAID', 'OVERPAID', 'REFUND_REQUESTED', 'PAID_HOLD_CONFLICT')) OR
        (OLD.status = 'EXPIRED' AND NEW.status IN ('PAID', 'OVERPAID', 'PAID_HOLD_CONFLICT')) OR
        (OLD.status = 'PAID' AND NEW.status IN ('OVERPAID', 'REVEALED', 'REFUND_REQUESTED')) OR
        (OLD.status = 'OVERPAID' AND NEW.status IN ('REVEALED', 'REFUND_REQUESTED')) OR
        (OLD.status = 'PAID_HOLD_CONFLICT' AND NEW.status IN ('PAID', 'OVERPAID', 'REFUND_REQUESTED', 'REFUND_APPROVED')) OR
        (OLD.status = 'REVEALED' AND NEW.status IN ('COMPLETED', 'REFUND_REQUESTED')) OR
        (OLD.status = 'REFUND_REQUESTED' AND NEW.status IN ('REFUND_APPROVED', 'PAID', 'OVERPAID', 'REVEALED', 'PAID_HOLD_CONFLICT')) OR
        (OLD.status = 'REFUND_APPROVED' AND NEW.status IN ('REFUND_PROCESSING')) OR
        (OLD.status = 'REFUND_PROCESSING' AND NEW.status IN ('REFUNDED', 'REFUND_RECONCILIATION_REQUIRED', 'REFUND_APPROVED')) OR
        (OLD.status = 'REFUND_RECONCILIATION_REQUIRED' AND NEW.status IN ('REFUNDED', 'REFUND_APPROVED'))
    ) THEN
        RAISE EXCEPTION 'ILLEGAL_BOOKING_STATE_TRANSITION: Cannot transition booking % from % to %.',
            OLD.booking_code, OLD.status, NEW.status USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_booking_state_transition ON public.bookings;
CREATE TRIGGER trg_enforce_booking_state_transition
BEFORE UPDATE OF status ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_state_transition_v4();

-- TABLE #14: booking_items
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.partner_inventories(id) ON DELETE RESTRICT,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('HOTEL_ROOM', 'FLIGHT_SEAT')),
    quantity SMALLINT NOT NULL CHECK (quantity > 0),
    unit_price_vnd BIGINT NOT NULL CHECK (unit_price_vnd >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bk_items_inv UNIQUE (booking_id, inventory_id)
);
CREATE INDEX IF NOT EXISTS idx_bk_items_booking ON public.booking_items(booking_id);

-- TABLE #15: booking_travelers
CREATE TABLE IF NOT EXISTS public.booking_travelers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    traveler_index SMALLINT NOT NULL CHECK (traveler_index BETWEEN 1 AND 20),
    full_name VARCHAR(120) NOT NULL CHECK (length(trim(full_name)) >= 2),
    id_card_ciphertext TEXT,
    key_version SMALLINT NOT NULL DEFAULT 1 CHECK (key_version >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_booking_traveler_idx UNIQUE (booking_id, traveler_index)
);
CREATE INDEX IF NOT EXISTS idx_travelers_booking ON public.booking_travelers(booking_id);

-- TABLE #16: inventory_holds
CREATE TABLE IF NOT EXISTS public.inventory_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.partner_inventories(id) ON DELETE RESTRICT,
    quantity SMALLINT NOT NULL CHECK (quantity > 0),
    hold_status VARCHAR(20) NOT NULL DEFAULT 'HELD'
        CHECK (hold_status IN ('HELD', 'COMMITTED', 'EXPIRED', 'RELEASED')),
    expires_at TIMESTAMPTZ NOT NULL,
    committed_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_hold_booking_inv UNIQUE (booking_id, inventory_id)
);
CREATE INDEX IF NOT EXISTS idx_holds_status_expires ON public.inventory_holds(hold_status, expires_at) WHERE hold_status = 'HELD';
CREATE INDEX IF NOT EXISTS idx_holds_booking ON public.inventory_holds(booking_id);

-- TABLE #17: booking_status_history
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    from_booking_status VARCHAR(35),
    to_booking_status VARCHAR(35) NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bk_hist_booking_time ON public.booking_status_history(booking_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_immutable_booking_status_history ON public.booking_status_history;
CREATE TRIGGER trg_immutable_booking_status_history
BEFORE UPDATE OR DELETE ON public.booking_status_history
FOR EACH ROW EXECUTE FUNCTION public.prevent_immutable_modification();

-- ============================================================================
-- DOMAIN 5: PAYMENTS, WEBHOOKS & REFUNDS (TABLES #18 - #21)
-- ============================================================================

-- TABLE #18: payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    expected_amount_vnd BIGINT NOT NULL CHECK (expected_amount_vnd > 0),
    paid_amount_vnd BIGINT NOT NULL DEFAULT 0 CHECK (paid_amount_vnd >= 0),
    refunded_amount_vnd BIGINT NOT NULL DEFAULT 0 CHECK (refunded_amount_vnd >= 0),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID'
        CHECK (payment_status IN ('UNPAID', 'UNDERPAID', 'PAID', 'OVERPAID', 'PARTIALLY_REFUNDED', 'REFUNDED')),
    last_transaction_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

-- TABLE #19: payment_webhook_events (Durable Webhook Inbox)
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(30) NOT NULL DEFAULT 'SEPAY',
    provider_event_id VARCHAR(120) NOT NULL,
    matched_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT TRUE,
    raw_payload JSONB NOT NULL,
    processing_status VARCHAR(35) NOT NULL DEFAULT 'RECEIVED'
        CHECK (processing_status IN (
            'RECEIVED',
            'QUEUED_DURING_CUTOVER',
            'PROCESSED',
            'IGNORED_DUPLICATE',
            'FAILED_UNMATCHED',
            'LATE_PAYMENT_CONFLICT'
        )),
    error_message TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    CONSTRAINT uq_webhook_provider_event UNIQUE (provider, provider_event_id)
);
CREATE INDEX IF NOT EXISTS idx_webhook_status_time ON public.payment_webhook_events(processing_status, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_booking ON public.payment_webhook_events(matched_booking_id);

-- TABLE #20: payment_transactions (Provider-Scoped UNIQUE(payment_provider, external_transaction_id))
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    webhook_event_id UUID UNIQUE REFERENCES public.payment_webhook_events(id) ON DELETE RESTRICT,
    payment_provider VARCHAR(30) NOT NULL DEFAULT 'SEPAY',
    external_transaction_id VARCHAR(120) NOT NULL,
    amount_vnd BIGINT NOT NULL CHECK (amount_vnd > 0),
    direction VARCHAR(20) NOT NULL DEFAULT 'INFLOW'
        CHECK (direction IN ('INFLOW', 'OUTFLOW_REFUND')),
    bank_code VARCHAR(30),
    transfer_content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pay_tx_provider_ext_id UNIQUE (payment_provider, external_transaction_id)
);
CREATE INDEX IF NOT EXISTS idx_pay_tx_booking ON public.payment_transactions(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pay_tx_created ON public.payment_transactions(created_at DESC);

DROP TRIGGER IF EXISTS trg_immutable_payment_transactions ON public.payment_transactions;
CREATE TRIGGER trg_immutable_payment_transactions
BEFORE UPDATE OR DELETE ON public.payment_transactions
FOR EACH ROW EXECUTE FUNCTION public.prevent_immutable_modification();

-- TABLE #21: refunds (4-Phase Asynchronous Refund Lifecycle)
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    tier_applied VARCHAR(30) NOT NULL
        CHECK (tier_applied IN ('EARLY_72H', 'WINDOW_24_72H', 'LATE_OR_REVEALED', 'FORCE_MAJEURE', 'HOLD_CONFLICT_FULL')),
    paid_snapshot_vnd BIGINT NOT NULL CHECK (paid_snapshot_vnd >= 0),
    cancellation_fee_vnd BIGINT NOT NULL CHECK (cancellation_fee_vnd >= 0),
    partner_comp_vnd BIGINT NOT NULL DEFAULT 0 CHECK (partner_comp_vnd >= 0),
    refund_amount_vnd BIGINT NOT NULL CHECK (refund_amount_vnd >= 0 AND refund_amount_vnd + cancellation_fee_vnd <= paid_snapshot_vnd),
    reason TEXT,
    evidence_url TEXT,
    status VARCHAR(35) NOT NULL DEFAULT 'QUOTED'
        CHECK (status IN (
            'QUOTED',
            'REQUESTED',
            'APPROVED',
            'PROCESSING',
            'RECONCILIATION_REQUIRED',
            'SUCCEEDED',
            'FAILED',
            'REJECTED'
        )),
    payout_bank_ref VARCHAR(120),
    failure_reason TEXT,
    requested_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_refunds_active_booking ON public.refunds(booking_id)
    WHERE status IN ('REQUESTED', 'APPROVED', 'PROCESSING', 'RECONCILIATION_REQUIRED');
CREATE INDEX IF NOT EXISTS idx_refunds_booking_status ON public.refunds(booking_id, status);
CREATE INDEX IF NOT EXISTS idx_refunds_req_user ON public.refunds(requested_by, created_at DESC);

-- ============================================================================
-- DOMAIN 6 & 7: USER EXPERIENCE, GOVERNANCE & TRANSACTIONAL OUTBOX (TABLES #22 - #27)
-- ============================================================================

-- TABLE #22: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    ai_match_rating SMALLINT NOT NULL CHECK (ai_match_rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL CHECK (length(trim(review_text)) BETWEEN 5 AND 2000),
    moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED'
        CHECK (moderation_status IN ('PENDING', 'APPROVED', 'HIDDEN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(moderation_status, created_at DESC);

-- TABLE #23: saved_packages
CREATE TABLE IF NOT EXISTS public.saved_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_saved_user_pkg UNIQUE (user_id, package_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_pkg_user ON public.saved_packages(user_id);

-- TABLE #24: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL DEFAULT 'IN_APP'
        CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS')),
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON public.notifications(user_id, is_read, created_at DESC);

-- TABLE #25: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role VARCHAR(30) NOT NULL,
    action_type VARCHAR(60) NOT NULL,
    target_table VARCHAR(60) NOT NULL,
    target_id VARCHAR(120) NOT NULL,
    ip_address VARCHAR(64),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor_time ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_target ON public.audit_logs(target_table, target_id);

DROP TRIGGER IF EXISTS trg_immutable_audit_logs ON public.audit_logs;
CREATE TRIGGER trg_immutable_audit_logs
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_immutable_modification();

-- TABLE #26: system_settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(80) PRIMARY KEY CHECK (length(trim(key)) > 0),
    value_jsonb JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_settings_public ON public.system_settings(is_public) WHERE is_public = TRUE;

-- TABLE #27: outbox_events (Transactional Outbox)
CREATE TABLE IF NOT EXISTS public.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(40) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(60) NOT NULL,
    idempotency_key VARCHAR(120) UNIQUE NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'DEAD_LETTER')),
    attempt_count SMALLINT NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    max_attempts SMALLINT NOT NULL DEFAULT 8 CHECK (max_attempts >= 1),
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_by VARCHAR(80),
    locked_until TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_outbox_poll ON public.outbox_events(status, next_attempt_at ASC)
    WHERE status IN ('PENDING', 'PROCESSING');
CREATE INDEX IF NOT EXISTS idx_outbox_aggregate ON public.outbox_events(aggregate_type, aggregate_id);
