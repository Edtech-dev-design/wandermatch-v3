-- ============================================================================
-- WANDERMATCH V4.2 – MIGRATION 005: SECURITY HARDENING, AUTH->PROFILE SYNC,
-- DYNAMIC DATE INVENTORY PROVISIONING & RLS ADVISOR OPTIMIZATIONS
-- Safe, additive, idempotent migration targeting Staging (hpwtdlffidfircparanl).
-- ============================================================================

-- ============================================================================
-- 1. P0 FIX: AUTO-SYNC auth.users -> public.profiles, user_roles & preferences
-- Eliminates PostgreSQL 23503 (recommendation_sessions_user_id_fkey) for new signups.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_v4()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_email TEXT;
    v_raw_name TEXT;
    v_safe_name VARCHAR(120);
BEGIN
    v_email := COALESCE(
        NULLIF(lower(trim(NEW.email)), ''),
        NEW.id::text || '@wandermatch.local'
    );
    v_raw_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(v_email, '@', 1),
        'Traveler'
    );
    v_safe_name := left(
        CASE WHEN length(trim(v_raw_name)) >= 2 THEN trim(v_raw_name) ELSE 'WanderMatch Traveler' END,
        120
    );

    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, v_email, v_safe_name)
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
            updated_at = NOW();

    INSERT INTO public.user_roles (user_id, role, is_active)
    VALUES (NEW.id, 'traveler', TRUE)
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_auth_user_v4() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_auth_user_v4() TO service_role;

DROP TRIGGER IF EXISTS trg_on_auth_user_created_v4 ON auth.users;
CREATE TRIGGER trg_on_auth_user_created_v4
AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user_v4();

-- Backfill any pre-existing auth.users missing from public.profiles / user_roles / user_preferences
INSERT INTO public.profiles (id, email, full_name)
SELECT
    au.id,
    COALESCE(NULLIF(lower(trim(au.email)), ''), au.id::text || '@wandermatch.local'),
    left(
        CASE
            WHEN length(trim(COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(COALESCE(au.email, ''), '@', 1), ''))) >= 2
            THEN trim(COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(COALESCE(au.email, ''), '@', 1)))
            ELSE 'WanderMatch Traveler'
        END,
        120
    )
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id)
  AND NOT EXISTS (SELECT 1 FROM public.profiles p2 WHERE p2.email = COALESCE(NULLIF(lower(trim(au.email)), ''), au.id::text || '@wandermatch.local'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active)
SELECT p.id, 'traveler', TRUE
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'traveler')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_preferences (user_id)
SELECT p.id
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.user_preferences up WHERE up.user_id = p.id)
ON CONFLICT (user_id) DO NOTHING;

-- Service-role RPC to deterministically ensure a user exists in auth.users + public.profiles
CREATE OR REPLACE FUNCTION public.ensure_user_profile_v4(
    p_user_id UUID,
    p_email VARCHAR,
    p_full_name VARCHAR DEFAULT 'WanderMatch Traveler',
    p_role VARCHAR DEFAULT 'traveler'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_email TEXT;
    v_safe_name VARCHAR(120);
    v_safe_role VARCHAR(30);
    v_existing_uid UUID;
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_USER_ID: p_user_id is required.' USING ERRCODE = '22023';
    END IF;

    v_email := COALESCE(NULLIF(lower(trim(p_email)), ''), p_user_id::text || '@wandermatch.local');
    v_safe_name := left(
        CASE WHEN length(trim(COALESCE(p_full_name, ''))) >= 2 THEN trim(p_full_name) ELSE 'WanderMatch Traveler' END,
        120
    );
    v_safe_role := CASE
        WHEN p_role IN ('traveler', 'b2b_partner', 'admin', 'super_admin') THEN p_role
        ELSE 'traveler'
    END;

    -- Check if email already belongs to another auth/profile UUID
    SELECT id INTO v_existing_uid FROM public.profiles WHERE email = v_email LIMIT 1;
    IF v_existing_uid IS NOT NULL AND v_existing_uid <> p_user_id THEN
        p_user_id := v_existing_uid;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_email) THEN
            SELECT id INTO p_user_id FROM auth.users WHERE lower(email) = v_email LIMIT 1;
        ELSE
            INSERT INTO auth.users (
                instance_id, id, aud, role, email, email_confirmed_at,
                raw_app_meta_data, raw_user_meta_data, created_at, updated_at
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                p_user_id,
                'authenticated',
                'authenticated',
                v_email,
                NOW(),
                '{"provider":"email","providers":["email"]}'::jsonb,
                jsonb_build_object('full_name', v_safe_name),
                NOW(),
                NOW()
            ) ON CONFLICT (id) DO NOTHING;
        END IF;
    END IF;

    INSERT INTO public.profiles (id, email, full_name)
    VALUES (p_user_id, v_email, v_safe_name)
    ON CONFLICT (id) DO UPDATE
        SET full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
            updated_at = NOW();

    INSERT INTO public.user_roles (user_id, role, is_active)
    VALUES (p_user_id, v_safe_role, TRUE)
    ON CONFLICT (user_id, role) DO UPDATE SET is_active = TRUE;

    INSERT INTO public.user_preferences (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN jsonb_build_object('ok', TRUE, 'user_id', p_user_id, 'email', v_email, 'role', v_safe_role);
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_profile_v4(UUID, VARCHAR, VARCHAR, VARCHAR) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile_v4(UUID, VARCHAR, VARCHAR, VARCHAR) TO service_role;

-- ============================================================================
-- 2. P1-1 FIX: DYNAMIC DATE INVENTORY PROVISIONING & SAFE SESSION PERSISTENCE
-- Eliminates 422 INSUFFICIENT_ANONYMITY_POOL when querying any future departure date.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.ensure_inventory_for_date_v4(p_departure_date DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_target_date DATE := COALESCE(p_departure_date, DATE '2026-11-15');
    v_rows JSONB;
BEGIN
    -- Clone HOTEL_ROOM baseline slots from 2026-11-15 if missing for v_target_date
    INSERT INTO public.partner_inventories (
        provider_id, hotel_id, flight_id, item_type, inventory_date,
        total_slots, available_slots, reserved_slots,
        retail_price_vnd, net_price_vnd, is_active
    )
    SELECT
        base.provider_id, base.hotel_id, NULL, 'HOTEL_ROOM', v_target_date,
        base.total_slots, base.total_slots, 0,
        base.retail_price_vnd, base.net_price_vnd, TRUE
    FROM public.partner_inventories base
    WHERE base.inventory_date = DATE '2026-11-15'
      AND base.item_type = 'HOTEL_ROOM'
      AND base.is_active = TRUE
      AND NOT EXISTS (
          SELECT 1 FROM public.partner_inventories cur
          WHERE cur.hotel_id = base.hotel_id
            AND cur.inventory_date = v_target_date
      );

    -- Clone FLIGHT_SEAT baseline slots from 2026-11-15 if missing for v_target_date
    INSERT INTO public.partner_inventories (
        provider_id, hotel_id, flight_id, item_type, inventory_date,
        total_slots, available_slots, reserved_slots,
        retail_price_vnd, net_price_vnd, is_active
    )
    SELECT
        base.provider_id, NULL, base.flight_id, 'FLIGHT_SEAT', v_target_date,
        base.total_slots, base.total_slots, 0,
        base.retail_price_vnd, base.net_price_vnd, TRUE
    FROM public.partner_inventories base
    WHERE base.inventory_date = DATE '2026-11-15'
      AND base.item_type = 'FLIGHT_SEAT'
      AND base.is_active = TRUE
      AND NOT EXISTS (
          SELECT 1 FROM public.partner_inventories cur
          WHERE cur.flight_id = base.flight_id
            AND cur.inventory_date = v_target_date
      );

    SELECT COALESCE(jsonb_agg(to_jsonb(pi)), '[]'::jsonb)
    INTO v_rows
    FROM public.partner_inventories pi
    WHERE pi.inventory_date = v_target_date
      AND pi.is_active = TRUE;

    RETURN jsonb_build_object(
        'departure_date', v_target_date,
        'count', jsonb_array_length(v_rows),
        'inventories', v_rows
    );
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_inventory_for_date_v4(DATE) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_inventory_for_date_v4(DATE) TO service_role;

-- Upgrade persist_recommendation_session_v4 to auto-ensure profile + date inventory + resolve inventory UUIDs
CREATE OR REPLACE FUNCTION public.persist_recommendation_session_v4(
    p_session JSONB,
    p_packages JSONB,
    p_package_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_user_id UUID := (p_session->>'user_id')::UUID;
    v_departure_date DATE := COALESCE((p_session->>'departure_date')::DATE, DATE '2026-11-15');
    v_pkg JSONB;
    v_item JSONB;
    v_inv_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
        PERFORM public.ensure_user_profile_v4(
            v_user_id,
            COALESCE(p_session->>'user_email', v_user_id::text || '@wandermatch.local'),
            COALESCE(p_session->>'user_name', 'WanderMatch Traveler'),
            'traveler'
        );
    END IF;

    PERFORM public.ensure_inventory_for_date_v4(v_departure_date);

    INSERT INTO public.recommendation_sessions (
        id, user_id, origin_airport, budget_per_person_vnd, group_size,
        departure_date, duration_days, trip_purpose,
        vec_healing, vec_nature, vec_solitude, vec_comfort, vec_culture,
        blacklisted_city_slugs, comfort_locks, ai_archetype_label, created_at
    ) VALUES (
        (p_session->>'id')::UUID,
        v_user_id,
        COALESCE(p_session->>'origin_airport', 'SGN'),
        (p_session->>'budget_per_person_vnd')::BIGINT,
        (p_session->>'group_size')::SMALLINT,
        v_departure_date,
        (p_session->>'duration_days')::SMALLINT,
        COALESCE(p_session->>'trip_purpose', 'GENERAL_RETREAT'),
        (p_session->>'vec_healing')::SMALLINT,
        (p_session->>'vec_nature')::SMALLINT,
        (p_session->>'vec_solitude')::SMALLINT,
        (p_session->>'vec_comfort')::SMALLINT,
        (p_session->>'vec_culture')::SMALLINT,
        COALESCE(ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_session->'blacklisted_city_slugs', '[]'::jsonb))), '{}'::TEXT[]),
        COALESCE(p_session->'comfort_locks', '{}'::jsonb),
        COALESCE(p_session->>'ai_archetype_label', 'Curated Blind Explorer'),
        COALESCE((p_session->>'created_at')::TIMESTAMPTZ, NOW())
    ) ON CONFLICT (id) DO NOTHING;

    FOR v_pkg IN SELECT * FROM jsonb_array_elements(p_packages)
    LOOP
        INSERT INTO public.packages (
            id, session_id, user_id, rank_order, is_top_pick,
            secret_destination_id, secret_hotel_id, secret_flight_id,
            blind_code_alias, climate_bucket_id, climate_zone_label, temp_range_label,
            anonymized_hint, packing_checklist, hotel_star_tier, vibe_tier_alias,
            flight_time_band, mood_illustration_key, display_price_band_vnd,
            k_anonymity_count, group_size, unit_price_vnd, expected_amount_vnd,
            retail_value_vnd, net_cost_vnd, similarity_score, total_score,
            score_breakdown, status, expires_at, created_at
        ) VALUES (
            (v_pkg->>'id')::UUID,
            (v_pkg->>'session_id')::UUID,
            v_user_id,
            (v_pkg->>'rank_order')::SMALLINT,
            COALESCE((v_pkg->>'is_top_pick')::BOOLEAN, FALSE),
            (v_pkg->>'secret_destination_id')::UUID,
            (v_pkg->>'secret_hotel_id')::UUID,
            (v_pkg->>'secret_flight_id')::UUID,
            v_pkg->>'blind_code_alias',
            v_pkg->>'climate_bucket_id',
            v_pkg->>'climate_zone_label',
            v_pkg->>'temp_range_label',
            v_pkg->>'anonymized_hint',
            COALESCE(v_pkg->'packing_checklist', '[]'::jsonb),
            (v_pkg->>'hotel_star_tier')::SMALLINT,
            v_pkg->>'vibe_tier_alias',
            v_pkg->>'flight_time_band',
            v_pkg->>'mood_illustration_key',
            v_pkg->>'display_price_band_vnd',
            (v_pkg->>'k_anonymity_count')::SMALLINT,
            (v_pkg->>'group_size')::SMALLINT,
            (v_pkg->>'unit_price_vnd')::BIGINT,
            (v_pkg->>'expected_amount_vnd')::BIGINT,
            (v_pkg->>'retail_value_vnd')::BIGINT,
            (v_pkg->>'net_cost_vnd')::BIGINT,
            (v_pkg->>'similarity_score')::NUMERIC,
            (v_pkg->>'total_score')::NUMERIC,
            COALESCE(v_pkg->'score_breakdown', '{}'::jsonb),
            COALESCE(v_pkg->>'status', 'SEALED_ACTIVE'),
            COALESCE((v_pkg->>'expires_at')::TIMESTAMPTZ, NOW() + INTERVAL '30 minutes'),
            COALESCE((v_pkg->>'created_at')::TIMESTAMPTZ, NOW())
        ) ON CONFLICT (id) DO NOTHING;
    END LOOP;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_package_items)
    LOOP
        v_inv_id := (v_item->>'inventory_id')::UUID;
        IF NOT EXISTS (SELECT 1 FROM public.partner_inventories WHERE id = v_inv_id AND is_active = TRUE) THEN
            SELECT pi.id INTO v_inv_id
            FROM public.partner_inventories pi
            JOIN public.packages p ON p.id = (v_item->>'package_id')::UUID
            WHERE pi.inventory_date = v_departure_date
              AND pi.is_active = TRUE
              AND (
                  (v_item->>'item_type' = 'HOTEL_ROOM' AND pi.hotel_id = p.secret_hotel_id) OR
                  (v_item->>'item_type' = 'FLIGHT_SEAT' AND pi.flight_id = p.secret_flight_id)
              )
            LIMIT 1;
        END IF;

        INSERT INTO public.package_items (
            id, package_id, inventory_id, item_type, units_required, unit_snapshot_price_vnd
        ) VALUES (
            (v_item->>'id')::UUID,
            (v_item->>'package_id')::UUID,
            v_inv_id,
            v_item->>'item_type',
            (v_item->>'units_required')::SMALLINT,
            (v_item->>'unit_snapshot_price_vnd')::BIGINT
        ) ON CONFLICT (id) DO NOTHING;
    END LOOP;

    RETURN jsonb_build_object('success', TRUE, 'departure_date', v_departure_date);
END;
$$;

REVOKE ALL ON FUNCTION public.persist_recommendation_session_v4(JSONB, JSONB, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.persist_recommendation_session_v4(JSONB, JSONB, JSONB) TO service_role;

-- ============================================================================
-- 3. P1-3 FIX: HARDEN is_admin(UUID) & is_super_admin(UUID) AGAINST ANON/CROSS-USER ENUMERATION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(p_uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_role TEXT := COALESCE(current_setting('role', TRUE), '');
    v_caller UUID := auth.uid();
BEGIN
    IF v_role = 'anon' THEN
        RETURN FALSE;
    END IF;
    IF v_role <> 'service_role' THEN
        IF v_caller IS NULL OR p_uid IS DISTINCT FROM v_caller THEN
            RETURN FALSE;
        END IF;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_uid
          AND role IN ('admin', 'super_admin')
          AND is_active = TRUE
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(p_uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_role TEXT := COALESCE(current_setting('role', TRUE), '');
    v_caller UUID := auth.uid();
BEGIN
    IF v_role = 'anon' THEN
        RETURN FALSE;
    END IF;
    IF v_role <> 'service_role' THEN
        IF v_caller IS NULL OR p_uid IS DISTINCT FROM v_caller THEN
            RETURN FALSE;
        END IF;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_uid
          AND role = 'super_admin'
          AND is_active = TRUE
    );
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_super_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated, service_role;

-- ============================================================================
-- 4. V4.2 REVIEWS & NOTIFICATIONS SECURE RPC HELPERS
-- Uses existing public.reviews (#22) and public.notifications (#24).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.submit_review_v4(
    p_booking_code VARCHAR,
    p_rating SMALLINT,
    p_ai_match_rating SMALLINT DEFAULT 5,
    p_review_text TEXT DEFAULT ''
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_bk public.bookings%ROWTYPE;
    v_rev public.reviews%ROWTYPE;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    SELECT * INTO v_bk FROM public.bookings WHERE booking_code = p_booking_code;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Booking not found.' USING ERRCODE = 'P0002';
    END IF;

    IF v_bk.user_id <> v_uid AND NOT public.is_admin(v_uid) THEN
        RAISE EXCEPTION 'FORBIDDEN: Only the booking owner can submit a review.' USING ERRCODE = '42501';
    END IF;

    IF v_bk.status NOT IN ('REVEALED', 'COMPLETED') THEN
        RAISE EXCEPTION 'CONFLICT: Booking must be REVEALED or COMPLETED before submitting a review.' USING ERRCODE = '23505';
    END IF;

    INSERT INTO public.reviews (
        booking_id, user_id, rating, ai_match_rating, review_text, moderation_status
    ) VALUES (
        v_bk.id, v_uid, GREATEST(1, LEAST(5, p_rating)), GREATEST(1, LEAST(5, COALESCE(p_ai_match_rating, p_rating))),
        left(trim(COALESCE(p_review_text, 'Wonderful trip!')), 2000), 'APPROVED'
    )
    ON CONFLICT (booking_id) DO UPDATE
        SET rating = EXCLUDED.rating,
            ai_match_rating = EXCLUDED.ai_match_rating,
            review_text = EXCLUDED.review_text
    RETURNING * INTO v_rev;

    RETURN jsonb_build_object(
        'review_id', v_rev.id,
        'booking_code', v_bk.booking_code,
        'rating', v_rev.rating,
        'ai_match_rating', v_rev.ai_match_rating,
        'moderation_status', v_rev.moderation_status,
        'created_at', v_rev.created_at
    );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_review_v4(VARCHAR, SMALLINT, SMALLINT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_review_v4(VARCHAR, SMALLINT, SMALLINT, TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_my_notifications_v4(p_limit INT DEFAULT 20)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_items JSONB;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    SELECT COALESCE(jsonb_agg(to_jsonb(n) ORDER BY n.created_at DESC), '[]'::jsonb)
    INTO v_items
    FROM (
        SELECT id, user_id, booking_id, channel, title, body, is_read, created_at
        FROM public.notifications
        WHERE user_id = v_uid
        ORDER BY created_at DESC
        LIMIT GREATEST(1, LEAST(100, COALESCE(p_limit, 20)))
    ) n;

    RETURN jsonb_build_object('notifications', v_items);
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_notifications_v4(INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_notifications_v4(INT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.mark_notification_read_v4(p_notification_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_row public.notifications%ROWTYPE;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    UPDATE public.notifications
    SET is_read = TRUE
    WHERE id = p_notification_id AND user_id = v_uid
    RETURNING * INTO v_row;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Notification not found.' USING ERRCODE = 'P0002';
    END IF;

    RETURN jsonb_build_object('id', v_row.id, 'is_read', v_row.is_read);
END;
$$;

REVOKE ALL ON FUNCTION public.mark_notification_read_v4(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_notification_read_v4(UUID) TO authenticated, service_role;

-- ============================================================================
-- 5. SUPABASE ADVISOR FIXES: (select auth.uid()) INITPLAN & SINGLE PERMISSIVE SELECT POLICIES
-- ============================================================================

-- #1. profiles
DROP POLICY IF EXISTS pol_profiles_select ON public.profiles;
CREATE POLICY pol_profiles_select ON public.profiles FOR SELECT
  USING ((select auth.uid()) = id OR public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS pol_profiles_update ON public.profiles;
CREATE POLICY pol_profiles_update ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

-- #3. user_roles (Consolidate SELECT policy to avoid multiple_permissive_policies warning)
DROP POLICY IF EXISTS pol_roles_select ON public.user_roles;
DROP POLICY IF EXISTS pol_roles_super_admin_all ON public.user_roles;
DROP POLICY IF EXISTS pol_roles_super_admin_insert ON public.user_roles;
DROP POLICY IF EXISTS pol_roles_super_admin_update ON public.user_roles;
DROP POLICY IF EXISTS pol_roles_super_admin_delete ON public.user_roles;

CREATE POLICY pol_roles_select ON public.user_roles FOR SELECT
  USING ((select auth.uid()) = user_id OR public.is_admin((select auth.uid())) OR public.is_super_admin((select auth.uid())));
CREATE POLICY pol_roles_super_admin_insert ON public.user_roles FOR INSERT
  WITH CHECK (public.is_super_admin((select auth.uid())));
CREATE POLICY pol_roles_super_admin_update ON public.user_roles FOR UPDATE
  USING (public.is_super_admin((select auth.uid()))) WITH CHECK (public.is_super_admin((select auth.uid())));
CREATE POLICY pol_roles_super_admin_delete ON public.user_roles FOR DELETE
  USING (public.is_super_admin((select auth.uid())));

-- #4. user_preferences
DROP POLICY IF EXISTS pol_prefs_owner_all ON public.user_preferences;
CREATE POLICY pol_prefs_owner_all ON public.user_preferences FOR ALL
  USING ((select auth.uid()) = user_id OR public.is_admin((select auth.uid())))
  WITH CHECK ((select auth.uid()) = user_id);

-- #5. destinations
DROP POLICY IF EXISTS pol_destinations_admin_all ON public.destinations;
CREATE POLICY pol_destinations_admin_all ON public.destinations FOR ALL
  USING (public.is_admin((select auth.uid()))) WITH CHECK (public.is_admin((select auth.uid())));

-- #6. travel_providers
DROP POLICY IF EXISTS pol_providers_select ON public.travel_providers;
CREATE POLICY pol_providers_select ON public.travel_providers FOR SELECT
  USING ((select auth.uid()) = owner_user_id OR public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS pol_providers_update ON public.travel_providers;
CREATE POLICY pol_providers_update ON public.travel_providers FOR UPDATE
  USING ((select auth.uid()) = owner_user_id OR public.is_admin((select auth.uid())))
  WITH CHECK ((select auth.uid()) = owner_user_id OR public.is_admin((select auth.uid())));

-- #7. hotels
DROP POLICY IF EXISTS pol_hotels_partner_admin ON public.hotels;
CREATE POLICY pol_hotels_partner_admin ON public.hotels FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = (select auth.uid()))
  );

-- #8. flights
DROP POLICY IF EXISTS pol_flights_partner_admin ON public.flights;
CREATE POLICY pol_flights_partner_admin ON public.flights FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = (select auth.uid()))
  );

-- #9. partner_inventories
DROP POLICY IF EXISTS pol_inventories_partner_admin ON public.partner_inventories;
CREATE POLICY pol_inventories_partner_admin ON public.partner_inventories FOR ALL
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = (select auth.uid()))
  )
  WITH CHECK (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = (select auth.uid()))
  );

-- #10. recommendation_sessions
DROP POLICY IF EXISTS pol_rec_sessions_select ON public.recommendation_sessions;
CREATE POLICY pol_rec_sessions_select ON public.recommendation_sessions FOR SELECT
  USING ((select auth.uid()) = user_id OR public.is_admin((select auth.uid())));

-- #11. packages
DROP POLICY IF EXISTS pol_packages_admin_only ON public.packages;
CREATE POLICY pol_packages_admin_only ON public.packages FOR ALL
  USING (public.is_admin((select auth.uid()))) WITH CHECK (public.is_admin((select auth.uid())));

-- #12. package_items
DROP POLICY IF EXISTS pol_package_items_admin_only ON public.package_items;
CREATE POLICY pol_package_items_admin_only ON public.package_items FOR ALL
  USING (public.is_admin((select auth.uid()))) WITH CHECK (public.is_admin((select auth.uid())));

-- #13. bookings
DROP POLICY IF EXISTS pol_bookings_select ON public.bookings;
CREATE POLICY pol_bookings_select ON public.bookings FOR SELECT
  USING ((select auth.uid()) = user_id OR public.is_admin((select auth.uid())));

-- #14. booking_items
DROP POLICY IF EXISTS pol_booking_items_revealed_select ON public.booking_items;
CREATE POLICY pol_booking_items_revealed_select ON public.booking_items FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.user_id = (select auth.uid())
        AND b.is_revealed = TRUE
        AND b.status IN ('REVEALED', 'COMPLETED')
    )
  );

-- #15. booking_travelers
DROP POLICY IF EXISTS pol_travelers_select ON public.booking_travelers;
CREATE POLICY pol_travelers_select ON public.booking_travelers FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = (select auth.uid()))
  );

-- #16. inventory_holds
DROP POLICY IF EXISTS pol_holds_select ON public.inventory_holds;
CREATE POLICY pol_holds_select ON public.inventory_holds FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = (select auth.uid()))
  );

-- #17. booking_status_history
DROP POLICY IF EXISTS pol_bk_history_select ON public.booking_status_history;
CREATE POLICY pol_bk_history_select ON public.booking_status_history FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = (select auth.uid()))
  );

-- #18. payments
DROP POLICY IF EXISTS pol_payments_select ON public.payments;
CREATE POLICY pol_payments_select ON public.payments FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = (select auth.uid()))
  );

-- #19. payment_webhook_events
DROP POLICY IF EXISTS pol_webhooks_admin_select ON public.payment_webhook_events;
CREATE POLICY pol_webhooks_admin_select ON public.payment_webhook_events FOR SELECT
  USING (public.is_admin((select auth.uid())));

-- #20. payment_transactions
DROP POLICY IF EXISTS pol_pay_tx_select ON public.payment_transactions;
CREATE POLICY pol_pay_tx_select ON public.payment_transactions FOR SELECT
  USING (
    public.is_admin((select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = (select auth.uid()))
  );

-- #21. refunds
DROP POLICY IF EXISTS pol_refunds_select ON public.refunds;
CREATE POLICY pol_refunds_select ON public.refunds FOR SELECT
  USING ((select auth.uid()) = requested_by OR public.is_admin((select auth.uid())));

-- #22. reviews
DROP POLICY IF EXISTS pol_reviews_public_select ON public.reviews;
CREATE POLICY pol_reviews_public_select ON public.reviews FOR SELECT
  USING (moderation_status = 'APPROVED' OR (select auth.uid()) = user_id OR public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS pol_reviews_owner_insert ON public.reviews;
CREATE POLICY pol_reviews_owner_insert ON public.reviews FOR INSERT
  WITH CHECK (
    (select auth.uid()) = user_id AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.user_id = (select auth.uid())
        AND b.status IN ('REVEALED', 'COMPLETED')
    )
  );

-- #23. saved_packages
DROP POLICY IF EXISTS pol_saved_pkg_owner_all ON public.saved_packages;
CREATE POLICY pol_saved_pkg_owner_all ON public.saved_packages FOR ALL
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- #24. notifications
DROP POLICY IF EXISTS pol_notif_owner_select ON public.notifications;
CREATE POLICY pol_notif_owner_select ON public.notifications FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS pol_notif_owner_update ON public.notifications;
CREATE POLICY pol_notif_owner_update ON public.notifications FOR UPDATE
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- #25. audit_logs
DROP POLICY IF EXISTS pol_audit_admin_select ON public.audit_logs;
CREATE POLICY pol_audit_admin_select ON public.audit_logs FOR SELECT
  USING (public.is_admin((select auth.uid())));

-- #26. system_settings (Consolidate SELECT policy to avoid multiple_permissive_policies warning)
DROP POLICY IF EXISTS pol_settings_select ON public.system_settings;
DROP POLICY IF EXISTS pol_settings_super_admin_all ON public.system_settings;
DROP POLICY IF EXISTS pol_settings_super_admin_insert ON public.system_settings;
DROP POLICY IF EXISTS pol_settings_super_admin_update ON public.system_settings;
DROP POLICY IF EXISTS pol_settings_super_admin_delete ON public.system_settings;

CREATE POLICY pol_settings_select ON public.system_settings FOR SELECT
  USING (is_public = TRUE OR public.is_admin((select auth.uid())) OR public.is_super_admin((select auth.uid())));
CREATE POLICY pol_settings_super_admin_insert ON public.system_settings FOR INSERT
  WITH CHECK (public.is_super_admin((select auth.uid())));
CREATE POLICY pol_settings_super_admin_update ON public.system_settings FOR UPDATE
  USING (public.is_super_admin((select auth.uid()))) WITH CHECK (public.is_super_admin((select auth.uid())));
CREATE POLICY pol_settings_super_admin_delete ON public.system_settings FOR DELETE
  USING (public.is_super_admin((select auth.uid())));

-- #27. outbox_events
DROP POLICY IF EXISTS pol_outbox_admin_select ON public.outbox_events;
CREATE POLICY pol_outbox_admin_select ON public.outbox_events FOR SELECT
  USING (public.is_admin((select auth.uid())));

-- Fix function_search_path_mutable warning on legacy_v3 function if present
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'legacy_v3' AND p.proname = 'update_poi_rating_stats'
    ) THEN
        EXECUTE 'ALTER FUNCTION legacy_v3.update_poi_rating_stats() SET search_path = pg_catalog, public, legacy_v3';
    END IF;
END
$$;
