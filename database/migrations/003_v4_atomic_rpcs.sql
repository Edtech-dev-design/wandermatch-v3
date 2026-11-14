-- ============================================================================
-- WANDERMATCH V4.0 – MIGRATION 003: HARDENED ATOMIC RPCs (SECURITY DEFINER)
-- All functions use SET search_path = pg_catalog, public and explicit REVOKE/GRANT
-- ============================================================================

-- ============================================================================
-- 1. USER-CALLABLE RPC: get_my_masked_pii_v4()
-- Never exposes raw ciphertext, blind_index, or key_version to client JWT
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_my_masked_pii_v4()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_pii public.user_sensitive_pii%ROWTYPE;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    SELECT * INTO v_pii FROM public.user_sensitive_pii WHERE user_id = v_uid;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('has_pii', FALSE);
    END IF;

    RETURN jsonb_build_object(
        'has_pii', TRUE,
        'cccd_masked', '********' || v_pii.cccd_last4,
        'refund_bank_code', v_pii.refund_bank_code,
        'refund_bank_account_masked', '******' || v_pii.refund_bank_account_last4,
        'refund_bank_holder_normalized', v_pii.refund_bank_holder_normalized,
        'verified_at', v_pii.verified_at
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_masked_pii_v4() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_masked_pii_v4() TO authenticated, service_role;

-- ============================================================================
-- 2. USER-CALLABLE RPC: get_my_sealed_packages_v4(p_session_id UUID)
-- Returns only k-anonymous teaser columns; NEVER returns secret_* columns
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_my_sealed_packages_v4(p_session_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
STABLE
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_result JSONB;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'package_id', p.id,
            'session_id', p.session_id,
            'rank_order', p.rank_order,
            'is_top_pick', p.is_top_pick,
            'blind_code_alias', p.blind_code_alias,
            'climate_bucket_id', p.climate_bucket_id,
            'climate_zone_label', p.climate_zone_label,
            'temp_range_label', p.temp_range_label,
            'anonymized_hint', p.anonymized_hint,
            'packing_checklist', p.packing_checklist,
            'hotel_star_tier', p.hotel_star_tier,
            'vibe_tier_alias', p.vibe_tier_alias,
            'flight_time_band', p.flight_time_band,
            'mood_illustration_key', p.mood_illustration_key,
            'display_price_band_vnd', p.display_price_band_vnd,
            'k_anonymity_count', p.k_anonymity_count,
            'group_size', p.group_size,
            'unit_price_vnd', p.unit_price_vnd,
            'expected_amount_vnd', p.expected_amount_vnd,
            'retail_value_vnd', p.retail_value_vnd,
            'similarity_score', p.similarity_score,
            'total_score', p.total_score,
            'score_breakdown', p.score_breakdown,
            'status', p.status,
            'expires_at', p.expires_at
        ) ORDER BY p.rank_order ASC
    ), '[]'::jsonb)
    INTO v_result
    FROM public.packages p
    WHERE p.session_id = p_session_id
      AND (p.user_id = v_uid OR public.is_admin(v_uid));

    RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_sealed_packages_v4(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_sealed_packages_v4(UUID) TO authenticated, service_role;

-- ============================================================================
-- 3. USER-CALLABLE RPC: create_booking_with_hold_v4
-- Atomically locks package, decrements partner_inventories in deterministic UUID order,
-- creates booking, inventory_holds, booking_items, payments, travelers, and status history.
-- ============================================================================
CREATE SEQUENCE IF NOT EXISTS public.booking_code_v4_seq START 1;

CREATE OR REPLACE FUNCTION public.create_booking_with_hold_v4(
    p_package_id UUID,
    p_booking_code VARCHAR,
    p_departure_date DATE,
    p_duration_days SMALLINT,
    p_travelers JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_caller_uid UUID := auth.uid();
    v_pkg public.packages%ROWTYPE;
    v_existing_booking public.bookings%ROWTYPE;
    v_new_booking public.bookings%ROWTYPE;
    v_item RECORD;
    v_inv public.partner_inventories%ROWTYPE;
    v_hold_expires TIMESTAMPTZ := NOW() + INTERVAL '30 minutes';
    v_idx SMALLINT := 0;
    v_trav JSONB;
    v_actual_code VARCHAR(24);
BEGIN
    IF v_caller_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.system_settings
        WHERE key = 'cutover_mode' AND COALESCE((value_jsonb->>'write_freeze')::BOOLEAN, FALSE) = TRUE
    ) THEN
        RAISE EXCEPTION 'WRITE_FREEZE_ACTIVE: System is in maintenance write-freeze.' USING ERRCODE = '55000';
    END IF;

    -- Idempotent replay check if caller retries same package_id or explicit p_booking_code
    SELECT * INTO v_existing_booking
    FROM public.bookings
    WHERE (package_id = p_package_id OR (NULLIF(trim(p_booking_code), '') IS NOT NULL AND booking_code = NULLIF(trim(p_booking_code), '')))
      AND user_id = v_caller_uid
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'booking_id', v_existing_booking.id,
            'booking_code', v_existing_booking.booking_code,
            'status', v_existing_booking.status,
            'expected_amount_vnd', v_existing_booking.expected_amount_vnd,
            'paid_amount_vnd', v_existing_booking.paid_amount_vnd,
            'amount_due_vnd', v_existing_booking.amount_due_vnd,
            'hold_expires_at', v_existing_booking.hold_expires_at,
            'idempotent_replay', TRUE
        );
    END IF;

    v_actual_code := COALESCE(NULLIF(trim(p_booking_code), ''), 'WM' || to_char(NOW(), 'YYYY') || lpad(nextval('public.booking_code_v4_seq')::text, 4, '0'));

    -- 1. Lock the sealed package row FOR UPDATE
    SELECT * INTO v_pkg
    FROM public.packages
    WHERE id = p_package_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Package does not exist.' USING ERRCODE = 'P0002';
    END IF;

    IF v_pkg.user_id <> v_caller_uid THEN
        RAISE EXCEPTION 'FORBIDDEN: Package belongs to another user.' USING ERRCODE = '42501';
    END IF;

    IF v_pkg.status <> 'SEALED_ACTIVE' THEN
        RAISE EXCEPTION 'CONFLICT: Package is no longer active (status=%).', v_pkg.status USING ERRCODE = '23505';
    END IF;

    IF v_pkg.expires_at < NOW() THEN
        UPDATE public.packages SET status = 'EXPIRED' WHERE id = v_pkg.id;
        RAISE EXCEPTION 'GONE: Package quote has expired.' USING ERRCODE = 'P0001';
    END IF;

    -- 2. Lock and decrement partner_inventories in deterministic UUID order (prevents deadlocks!)
    FOR v_item IN
        SELECT pi.inventory_id, pi.item_type, pi.units_required, pi.unit_snapshot_price_vnd
        FROM public.package_items pi
        WHERE pi.package_id = v_pkg.id
        ORDER BY pi.inventory_id ASC
    LOOP
        SELECT * INTO v_inv
        FROM public.partner_inventories
        WHERE id = v_item.inventory_id AND is_active = TRUE
        FOR UPDATE;

        IF NOT FOUND OR v_inv.available_slots < v_item.units_required THEN
            RAISE EXCEPTION 'INSUFFICIENT_INVENTORY: Not enough available slots for item %.', v_item.item_type
                USING ERRCODE = 'P0001';
        END IF;

        UPDATE public.partner_inventories
        SET available_slots = available_slots - v_item.units_required,
            reserved_slots = reserved_slots + v_item.units_required,
            updated_at = NOW()
        WHERE id = v_inv.id;
    END LOOP;

    -- 3. Mark package as LOCKED_IN_BOOKING
    UPDATE public.packages
    SET status = 'LOCKED_IN_BOOKING'
    WHERE id = v_pkg.id;

    -- 4. Insert Booking record with authoritative expected_amount_vnd from package
    INSERT INTO public.bookings (
        booking_code, is_legacy_migrated, user_id, package_id, group_size,
        expected_amount_vnd, paid_amount_vnd, status,
        is_revealed, departure_date, return_date, hold_expires_at
    ) VALUES (
        v_actual_code, FALSE, v_caller_uid, v_pkg.id, v_pkg.group_size,
        v_pkg.expected_amount_vnd, 0, 'PENDING_PAYMENT',
        FALSE, p_departure_date, p_departure_date + GREATEST(1, p_duration_days), v_hold_expires
    ) RETURNING * INTO v_new_booking;

    -- 5. Insert inventory_holds and booking_items
    FOR v_item IN
        SELECT pi.inventory_id, pi.item_type, pi.units_required, pi.unit_snapshot_price_vnd
        FROM public.package_items pi
        WHERE pi.package_id = v_pkg.id
        ORDER BY pi.inventory_id ASC
    LOOP
        INSERT INTO public.inventory_holds (
            booking_id, inventory_id, quantity, hold_status, expires_at
        ) VALUES (
            v_new_booking.id, v_item.inventory_id, v_item.units_required, 'HELD', v_hold_expires
        );

        INSERT INTO public.booking_items (
            booking_id, inventory_id, item_type, quantity, unit_price_vnd
        ) VALUES (
            v_new_booking.id, v_item.inventory_id, v_item.item_type, v_item.units_required, v_item.unit_snapshot_price_vnd
        );
    END LOOP;

    -- 6. Insert 1:1 Payment summary record
    INSERT INTO public.payments (
        booking_id, expected_amount_vnd, paid_amount_vnd, refunded_amount_vnd, payment_status
    ) VALUES (
        v_new_booking.id, v_new_booking.expected_amount_vnd, 0, 0, 'UNPAID'
    );

    -- 7. Insert Travelers
    IF jsonb_typeof(p_travelers) = 'array' THEN
        FOR v_trav IN SELECT * FROM jsonb_array_elements(p_travelers)
        LOOP
            v_idx := v_idx + 1;
            INSERT INTO public.booking_travelers (
                booking_id, traveler_index, full_name, id_card_ciphertext, key_version
            ) VALUES (
                v_new_booking.id,
                v_idx,
                COALESCE(v_trav->>'full_name', 'Traveler ' || v_idx),
                v_trav->>'id_card_ciphertext',
                COALESCE((v_trav->>'key_version')::SMALLINT, 1)
            );
        END LOOP;
    END IF;

    -- 8. Record initial booking status history
    INSERT INTO public.booking_status_history (
        booking_id, from_booking_status, to_booking_status, changed_by, reason
    ) VALUES (
        v_new_booking.id, NULL, 'PENDING_PAYMENT', v_caller_uid, 'Booking created and inventory held for 30m.'
    );

    RETURN jsonb_build_object(
        'booking_id', v_new_booking.id,
        'booking_code', v_new_booking.booking_code,
        'status', v_new_booking.status,
        'expected_amount_vnd', v_new_booking.expected_amount_vnd,
        'paid_amount_vnd', v_new_booking.paid_amount_vnd,
        'amount_due_vnd', v_new_booking.amount_due_vnd,
        'hold_expires_at', v_new_booking.hold_expires_at,
        'idempotent_replay', FALSE
    );
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking_with_hold_v4(UUID, VARCHAR, DATE, SMALLINT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_booking_with_hold_v4(UUID, VARCHAR, DATE, SMALLINT, JSONB) TO authenticated, service_role;

-- ============================================================================
-- 4. SERVICE-ROLE RPC: ingest_webhook_event_v4 (Durable Webhook Inbox)
-- Durably stores webhook event BEFORE HTTP 200 OK even during Cutover Write-Freeze
-- ============================================================================
CREATE OR REPLACE FUNCTION public.ingest_webhook_event_v4(
    p_provider VARCHAR,
    p_provider_event_id VARCHAR,
    p_raw_payload JSONB,
    p_is_write_freeze BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_event public.payment_webhook_events%ROWTYPE;
    v_initial_status VARCHAR(35) := CASE WHEN p_is_write_freeze THEN 'QUEUED_DURING_CUTOVER' ELSE 'RECEIVED' END;
BEGIN
    INSERT INTO public.payment_webhook_events (
        provider, provider_event_id, raw_payload, signature_verified, processing_status
    ) VALUES (
        COALESCE(p_provider, 'SEPAY'), p_provider_event_id, p_raw_payload, TRUE, v_initial_status
    )
    ON CONFLICT (provider, provider_event_id) DO UPDATE
        SET raw_payload = EXCLUDED.raw_payload
    RETURNING * INTO v_event;

    RETURN jsonb_build_object(
        'webhook_event_id', v_event.id,
        'processing_status', v_event.processing_status,
        'persisted_durably', TRUE
    );
END;
$$;

REVOKE ALL ON FUNCTION public.ingest_webhook_event_v4(VARCHAR, VARCHAR, JSONB, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ingest_webhook_event_v4(VARCHAR, VARCHAR, JSONB, BOOLEAN) TO service_role;

-- ============================================================================
-- 5. SERVICE-ROLE RPC: process_payment_webhook_v4
-- Enforces UNIQUE(payment_provider, external_transaction_id), handles partial/overpaid
-- & late payment after EXPIRED hold (slot re-acquisition or PAID_HOLD_CONFLICT).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_payment_webhook_v4(
    p_provider VARCHAR,
    p_provider_event_id VARCHAR,
    p_external_tx_id VARCHAR,
    p_booking_code VARCHAR,
    p_transfer_amount BIGINT,
    p_transfer_content TEXT,
    p_bank_code VARCHAR,
    p_raw_payload JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_provider VARCHAR(30) := COALESCE(NULLIF(trim(p_provider), ''), 'SEPAY');
    v_resolved_code VARCHAR(30) := NULLIF(upper(trim(COALESCE(p_booking_code, ''))), '');
    v_code_matches TEXT[];
    v_booking public.bookings%ROWTYPE;
    v_payment public.payments%ROWTYPE;
    v_old_booking_status VARCHAR(35);
    v_webhook_id UUID;
    v_tx_id UUID;
    v_new_paid BIGINT;
    v_new_booking_status VARCHAR(35);
    v_new_payment_status VARCHAR(30);
    v_hold RECORD;
    v_inv public.partner_inventories%ROWTYPE;
    v_can_reacquire BOOLEAN := TRUE;
BEGIN
    IF p_transfer_amount IS NULL OR p_transfer_amount <= 0 THEN
        RAISE EXCEPTION 'INVALID_AMOUNT: Transfer amount must be positive.' USING ERRCODE = '22023';
    END IF;

    -- Extract and validate booking code from p_transfer_content when p_booking_code is omitted
    SELECT ARRAY(
        SELECT DISTINCT upper(m[1])
        FROM regexp_matches(COALESCE(p_transfer_content, ''), '\m(WM(?:-?[A-Za-z0-9]{4,16})+)\M', 'gi') AS m
    ) INTO v_code_matches;

    IF v_resolved_code IS NULL THEN
        IF COALESCE(array_length(v_code_matches, 1), 0) = 1 THEN
            v_resolved_code := v_code_matches[1];
        ELSIF COALESCE(array_length(v_code_matches, 1), 0) > 1 THEN
            -- Ambiguous multiple booking codes in transfer memo must be rejected safely
            v_resolved_code := '__AMBIGUOUS__';
        END IF;
    ELSIF COALESCE(array_length(v_code_matches, 1), 0) > 1 THEN
        v_resolved_code := '__AMBIGUOUS__';
    END IF;

    -- 0. Cutover Write-Freeze Check: Durably queue incoming webhooks without mutating bookings
    IF EXISTS (
        SELECT 1 FROM public.system_settings
        WHERE key = 'cutover_mode' AND COALESCE((value_jsonb->>'write_freeze')::BOOLEAN, FALSE) = TRUE
    ) THEN
        INSERT INTO public.payment_webhook_events (
            provider, provider_event_id, raw_payload, signature_verified, processing_status
        ) VALUES (
            v_provider,
            COALESCE(NULLIF(trim(p_provider_event_id), ''), p_external_tx_id),
            COALESCE(p_raw_payload, '{}'::jsonb) || jsonb_build_object(
                'provider', v_provider,
                'provider_event_id', COALESCE(NULLIF(trim(p_provider_event_id), ''), p_external_tx_id),
                'external_transaction_id', p_external_tx_id,
                'booking_code', v_resolved_code,
                'transfer_amount', p_transfer_amount,
                'transfer_content', p_transfer_content,
                'bank_code', p_bank_code
            ),
            TRUE,
            'QUEUED_DURING_CUTOVER'
        )
        ON CONFLICT (provider, provider_event_id) DO UPDATE
            SET raw_payload = EXCLUDED.raw_payload,
                processing_status = 'QUEUED_DURING_CUTOVER'
        RETURNING id INTO v_webhook_id;

        RETURN jsonb_build_object(
            'success', TRUE,
            'http_status', 200,
            'queued_during_cutover', TRUE,
            'webhook_event_id', v_webhook_id,
            'booking_code', v_resolved_code,
            'status', 'QUEUED_DURING_CUTOVER'
        );
    END IF;

    -- 1. Check if this provider-scoped bank transaction was already processed
    SELECT id INTO v_tx_id
    FROM public.payment_transactions
    WHERE payment_provider = v_provider
      AND external_transaction_id = p_external_tx_id
    LIMIT 1;

    IF v_tx_id IS NOT NULL THEN
        SELECT * INTO v_booking FROM public.bookings WHERE booking_code = v_resolved_code;
        RETURN jsonb_build_object(
            'success', TRUE,
            'http_status', 200,
            'idempotent_replay', TRUE,
            'booking_code', COALESCE(v_booking.booking_code, v_resolved_code),
            'status', COALESCE(v_booking.status, 'UNKNOWN'),
            'expected_amount_vnd', COALESCE(v_booking.expected_amount_vnd, 0),
            'paid_amount_vnd', COALESCE(v_booking.paid_amount_vnd, 0),
            'amount_due_vnd', COALESCE(v_booking.amount_due_vnd, 0),
            'overpaid_amount_vnd', COALESCE(v_booking.overpaid_amount_vnd, 0)
        );
    END IF;

    -- 2. Upsert raw webhook event keyed by UNIQUE(provider, provider_event_id)
    INSERT INTO public.payment_webhook_events (
        provider, provider_event_id, raw_payload, processing_status
    ) VALUES (
        v_provider, COALESCE(NULLIF(trim(p_provider_event_id), ''), p_external_tx_id), COALESCE(p_raw_payload, '{}'::jsonb), 'RECEIVED'
    )
    ON CONFLICT (provider, provider_event_id) DO UPDATE
        SET raw_payload = EXCLUDED.raw_payload
    RETURNING id INTO v_webhook_id;

    -- 3. Lock target Booking row FOR UPDATE
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE booking_code = v_resolved_code
    FOR UPDATE;

    IF NOT FOUND THEN
        UPDATE public.payment_webhook_events
        SET processing_status = 'FAILED_UNMATCHED',
            error_message = 'Booking code not found or ambiguous: ' || COALESCE(v_resolved_code, 'NULL'),
            processed_at = NOW()
        WHERE id = v_webhook_id;

        RETURN jsonb_build_object(
            'success', FALSE,
            'http_status', 404,
            'status', 'UNMATCHED_BOOKING_CODE',
            'error', 'Booking code not found or ambiguous.'
        );
    END IF;

    v_old_booking_status := v_booking.status;

    -- 4. Lock target Payment row FOR UPDATE
    SELECT * INTO v_payment
    FROM public.payments
    WHERE booking_id = v_booking.id
    FOR UPDATE;

    -- 5. Insert payment_transactions guarded by UNIQUE(payment_provider, external_transaction_id)
    INSERT INTO public.payment_transactions (
        payment_id, booking_id, webhook_event_id, payment_provider, external_transaction_id,
        amount_vnd, direction, bank_code, transfer_content
    ) VALUES (
        v_payment.id, v_booking.id, v_webhook_id, v_provider, p_external_tx_id,
        p_transfer_amount, 'INFLOW', p_bank_code, p_transfer_content
    )
    ON CONFLICT (payment_provider, external_transaction_id) DO NOTHING
    RETURNING id INTO v_tx_id;

    IF v_tx_id IS NULL THEN
        UPDATE public.payment_webhook_events
        SET processing_status = 'IGNORED_DUPLICATE',
            matched_booking_id = v_booking.id,
            processed_at = NOW()
        WHERE id = v_webhook_id;

        RETURN jsonb_build_object(
            'success', TRUE,
            'http_status', 200,
            'idempotent_replay', TRUE,
            'booking_code', v_booking.booking_code,
            'status', v_booking.status,
            'expected_amount_vnd', v_booking.expected_amount_vnd,
            'paid_amount_vnd', v_booking.paid_amount_vnd,
            'amount_due_vnd', v_booking.amount_due_vnd,
            'overpaid_amount_vnd', v_booking.overpaid_amount_vnd
        );
    END IF;

    -- 6. Calculate new cumulative paid amount
    v_new_paid := v_booking.paid_amount_vnd + p_transfer_amount;

    -- 7. Check if booking was already EXPIRED, CANCELLED, or REFUNDED when money arrived
    IF v_old_booking_status IN ('EXPIRED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUND_APPROVED', 'REFUND_PROCESSING', 'REFUNDED') THEN
        IF v_old_booking_status = 'EXPIRED' AND v_new_paid >= v_booking.expected_amount_vnd THEN
            FOR v_hold IN
                SELECT * FROM public.inventory_holds
                WHERE booking_id = v_booking.id
                ORDER BY inventory_id ASC
                FOR UPDATE
            LOOP
                IF v_hold.hold_status = 'EXPIRED' THEN
                    SELECT * INTO v_inv
                    FROM public.partner_inventories
                    WHERE id = v_hold.inventory_id AND is_active = TRUE
                    FOR UPDATE;

                    IF NOT FOUND OR v_inv.available_slots < v_hold.quantity THEN
                        v_can_reacquire := FALSE;
                    END IF;
                END IF;
            END LOOP;

            IF v_can_reacquire THEN
                FOR v_hold IN
                    SELECT * FROM public.inventory_holds
                    WHERE booking_id = v_booking.id AND hold_status = 'EXPIRED'
                    ORDER BY inventory_id ASC
                LOOP
                    UPDATE public.partner_inventories
                    SET available_slots = available_slots - v_hold.quantity,
                        reserved_slots = reserved_slots + v_hold.quantity,
                        updated_at = NOW()
                    WHERE id = v_hold.inventory_id;

                    UPDATE public.inventory_holds
                    SET hold_status = 'COMMITTED', committed_at = NOW(), updated_at = NOW()
                    WHERE id = v_hold.id;
                END LOOP;

                v_new_booking_status := CASE WHEN v_new_paid > v_booking.expected_amount_vnd THEN 'OVERPAID' ELSE 'PAID' END;
                v_new_payment_status := v_new_booking_status;
            ELSE
                v_new_booking_status := 'PAID_HOLD_CONFLICT';
                v_new_payment_status := CASE WHEN v_new_paid > v_booking.expected_amount_vnd THEN 'OVERPAID' ELSE 'PAID' END;
            END IF;
        ELSE
            v_new_booking_status := 'PAID_HOLD_CONFLICT';
            v_new_payment_status := CASE
                WHEN v_new_paid < v_booking.expected_amount_vnd THEN 'UNDERPAID'
                WHEN v_new_paid = v_booking.expected_amount_vnd THEN 'PAID'
                ELSE 'OVERPAID'
            END;
        END IF;
    ELSE
        IF v_new_paid < v_booking.expected_amount_vnd THEN
            v_new_booking_status := 'UNDERPAID';
            v_new_payment_status := 'UNDERPAID';
        ELSIF v_new_paid = v_booking.expected_amount_vnd THEN
            v_new_booking_status := CASE WHEN v_booking.is_revealed THEN 'REVEALED' ELSE 'PAID' END;
            v_new_payment_status := 'PAID';
        ELSE
            v_new_booking_status := CASE WHEN v_booking.is_revealed THEN 'REVEALED' ELSE 'OVERPAID' END;
            v_new_payment_status := 'OVERPAID';
        END IF;

        IF v_new_paid >= v_booking.expected_amount_vnd THEN
            UPDATE public.inventory_holds
            SET hold_status = 'COMMITTED',
                committed_at = COALESCE(committed_at, NOW()),
                updated_at = NOW()
            WHERE booking_id = v_booking.id AND hold_status = 'HELD';
        END IF;
    END IF;

    -- 8. Update bookings & payments atomically
    UPDATE public.bookings
    SET paid_amount_vnd = v_new_paid,
        status = v_new_booking_status,
        updated_at = NOW()
    WHERE id = v_booking.id
    RETURNING * INTO v_booking;

    UPDATE public.payments
    SET paid_amount_vnd = v_new_paid,
        payment_status = v_new_payment_status,
        last_transaction_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment.id;

    -- 9. Write accurate booking_status_history
    INSERT INTO public.booking_status_history (
        booking_id, from_booking_status, to_booking_status, reason
    ) VALUES (
        v_booking.id,
        v_old_booking_status,
        v_new_booking_status,
        'Webhook tx ' || p_external_tx_id || ' (+' || p_transfer_amount || ' VND)'
    );

    -- 10. Enqueue notification / conflict alert in Transactional Outbox (Table #27)
    IF v_new_booking_status IN ('PAID', 'OVERPAID', 'PAID_HOLD_CONFLICT') THEN
        INSERT INTO public.outbox_events (
            aggregate_type, aggregate_id, event_type, idempotency_key, payload
        ) VALUES (
            'BOOKING',
            v_booking.id,
            CASE WHEN v_new_booking_status = 'PAID_HOLD_CONFLICT' THEN 'HOLD_CONFLICT_ALERT' ELSE 'BOOKING_PAID_NOTIFICATION' END,
            'OUTBOX-WH-' || v_provider || '-' || p_external_tx_id,
            jsonb_build_object(
                'booking_id', v_booking.id,
                'booking_code', v_booking.booking_code,
                'status', v_booking.status,
                'paid_amount_vnd', v_booking.paid_amount_vnd
            )
        ) ON CONFLICT (idempotency_key) DO NOTHING;
    END IF;

    UPDATE public.payment_webhook_events
    SET matched_booking_id = v_booking.id,
        processing_status = CASE WHEN v_new_booking_status = 'PAID_HOLD_CONFLICT' THEN 'LATE_PAYMENT_CONFLICT' ELSE 'PROCESSED' END,
        processed_at = NOW()
    WHERE id = v_webhook_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'http_status', 200,
        'idempotent_replay', FALSE,
        'booking_code', v_booking.booking_code,
        'status', v_booking.status,
        'expected_amount_vnd', v_booking.expected_amount_vnd,
        'paid_amount_vnd', v_booking.paid_amount_vnd,
        'amount_due_vnd', v_booking.amount_due_vnd,
        'overpaid_amount_vnd', v_booking.overpaid_amount_vnd,
        'is_overpaid', (v_booking.overpaid_amount_vnd > 0)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.process_payment_webhook_v4(VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, TEXT, VARCHAR, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_payment_webhook_v4(VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, TEXT, VARCHAR, JSONB) TO service_role;

-- ============================================================================
-- 6. SERVICE-ROLE RPC: replay_queued_webhook_events_v4
-- Replays all QUEUED_DURING_CUTOVER webhook events after Write-Freeze ends
-- ============================================================================
CREATE OR REPLACE FUNCTION public.replay_queued_webhook_events_v4(p_batch_limit INT DEFAULT 200)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_evt public.payment_webhook_events%ROWTYPE;
    v_replayed_count INT := 0;
    v_res JSONB;
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.system_settings
        WHERE key = 'cutover_mode' AND COALESCE((value_jsonb->>'write_freeze')::BOOLEAN, FALSE) = TRUE
    ) THEN
        RAISE EXCEPTION 'WRITE_FREEZE_ACTIVE: Cannot replay queued webhooks while write-freeze is active.' USING ERRCODE = '55000';
    END IF;

    FOR v_evt IN
        SELECT * FROM public.payment_webhook_events
        WHERE processing_status = 'QUEUED_DURING_CUTOVER'
        ORDER BY received_at ASC
        LIMIT p_batch_limit
        FOR UPDATE SKIP LOCKED
    LOOP
        v_res := public.process_payment_webhook_v4(
            v_evt.provider,
            v_evt.provider_event_id,
            COALESCE(
                v_evt.raw_payload->>'external_transaction_id',
                v_evt.raw_payload->>'externalTransactionId',
                v_evt.raw_payload->>'transactionId',
                v_evt.raw_payload->>'id',
                v_evt.provider_event_id
            ),
            COALESCE(v_evt.raw_payload->>'booking_code', v_evt.raw_payload->>'bookingCode', ''),
            COALESCE(
                (v_evt.raw_payload->>'transfer_amount')::BIGINT,
                (v_evt.raw_payload->>'transferAmount')::BIGINT,
                (v_evt.raw_payload->>'amount')::BIGINT,
                0
            ),
            COALESCE(
                v_evt.raw_payload->>'transfer_content',
                v_evt.raw_payload->>'content',
                v_evt.raw_payload->>'transferContent',
                ''
            ),
            COALESCE(v_evt.raw_payload->>'bank_code', v_evt.raw_payload->>'bankCode', v_evt.raw_payload->>'gateway', 'MB'),
            v_evt.raw_payload
        );
        v_replayed_count := v_replayed_count + 1;
    END LOOP;

    RETURN jsonb_build_object('replayed_count', v_replayed_count);
END;
$$;

REVOKE ALL ON FUNCTION public.replay_queued_webhook_events_v4(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.replay_queued_webhook_events_v4(INT) TO service_role;

-- ============================================================================
-- 7. SERVICE-ROLE RPC: expire_stale_holds_v4
-- ============================================================================
CREATE OR REPLACE FUNCTION public.expire_stale_holds_v4(p_batch_limit INT DEFAULT 100)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_bk public.bookings%ROWTYPE;
    v_hold RECORD;
    v_expired_count INT := 0;
BEGIN
    FOR v_bk IN
        SELECT * FROM public.bookings
        WHERE status = 'PENDING_PAYMENT'
          AND paid_amount_vnd = 0
          AND hold_expires_at < NOW()
        ORDER BY hold_expires_at ASC
        LIMIT p_batch_limit
        FOR UPDATE SKIP LOCKED
    LOOP
        FOR v_hold IN
            SELECT * FROM public.inventory_holds
            WHERE booking_id = v_bk.id AND hold_status = 'HELD'
            ORDER BY inventory_id ASC
            FOR UPDATE
        LOOP
            UPDATE public.inventory_holds
            SET hold_status = 'EXPIRED',
                released_at = NOW(),
                updated_at = NOW()
            WHERE id = v_hold.id AND hold_status = 'HELD';

            IF FOUND THEN
                UPDATE public.partner_inventories
                SET available_slots = available_slots + v_hold.quantity,
                    reserved_slots = GREATEST(0, reserved_slots - v_hold.quantity),
                    updated_at = NOW()
                WHERE id = v_hold.inventory_id;
            END IF;
        END LOOP;

        UPDATE public.bookings
        SET status = 'EXPIRED', updated_at = NOW()
        WHERE id = v_bk.id;

        UPDATE public.packages
        SET status = 'EXPIRED'
        WHERE id = v_bk.package_id AND status = 'LOCKED_IN_BOOKING';

        INSERT INTO public.booking_status_history (
            booking_id, from_booking_status, to_booking_status, reason
        ) VALUES (
            v_bk.id, 'PENDING_PAYMENT', 'EXPIRED', 'Hold expired after 30m without payment.'
        );

        v_expired_count := v_expired_count + 1;
    END LOOP;

    RETURN jsonb_build_object('expired_bookings_count', v_expired_count);
END;
$$;

REVOKE ALL ON FUNCTION public.expire_stale_holds_v4(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.expire_stale_holds_v4(INT) TO service_role;

-- ============================================================================
-- 8. USER-CALLABLE RPC: reveal_blind_booking_v4
-- Enforces ownership, PAID/OVERPAID/REVEALED/COMPLETED status (blocks PAID_HOLD_CONFLICT!),
-- and verifies SUM(payment_transactions INFLOW) >= expected_amount_vnd.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.reveal_blind_booking_v4(p_booking_code VARCHAR)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_caller_uid UUID := auth.uid();
    v_is_admin BOOLEAN := public.is_admin(v_caller_uid);
    v_bk public.bookings%ROWTYPE;
    v_pkg public.packages%ROWTYPE;
    v_dest public.destinations%ROWTYPE;
    v_hotel public.hotels%ROWTYPE;
    v_flight public.flights%ROWTYPE;
    v_tx_sum BIGINT;
    v_old_status VARCHAR(35);
BEGIN
    IF v_caller_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required.' USING ERRCODE = '28000';
    END IF;

    SELECT * INTO v_bk
    FROM public.bookings
    WHERE booking_code = p_booking_code
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Booking does not exist.' USING ERRCODE = 'P0002';
    END IF;

    IF v_bk.user_id <> v_caller_uid AND NOT v_is_admin THEN
        RAISE EXCEPTION 'FORBIDDEN: Not the owner of this booking.' USING ERRCODE = '42501';
    END IF;

    IF v_bk.status = 'PAID_HOLD_CONFLICT' THEN
        RAISE EXCEPTION 'HOLD_CONFLICT: Booking has an unresolved inventory hold conflict and cannot be revealed.'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_bk.status NOT IN ('PAID', 'OVERPAID', 'REVEALED', 'COMPLETED') THEN
        RAISE EXCEPTION 'PAYMENT_REQUIRED: Booking is not eligible for reveal (status=%).', v_bk.status
            USING ERRCODE = 'P0001';
    END IF;

    SELECT COALESCE(SUM(amount_vnd), 0) INTO v_tx_sum
    FROM public.payment_transactions
    WHERE booking_id = v_bk.id AND direction = 'INFLOW';

    IF v_bk.paid_amount_vnd < v_bk.expected_amount_vnd OR v_tx_sum < v_bk.expected_amount_vnd THEN
        RAISE EXCEPTION 'PAYMENT_RECONCILIATION_FAILED: Verified inflows (%) are less than expected (%).',
            v_tx_sum, v_bk.expected_amount_vnd USING ERRCODE = 'P0001';
    END IF;

    v_old_status := v_bk.status;

    IF NOT v_bk.is_revealed THEN
        UPDATE public.bookings
        SET is_revealed = TRUE,
            revealed_at = NOW(),
            status = 'REVEALED',
            updated_at = NOW()
        WHERE id = v_bk.id
        RETURNING * INTO v_bk;

        INSERT INTO public.booking_status_history (
            booking_id, from_booking_status, to_booking_status, changed_by, reason
        ) VALUES (
            v_bk.id, v_old_status, 'REVEALED', v_caller_uid, 'Destination revealed by authorized owner.'
        );
    END IF;

    INSERT INTO public.audit_logs (
        actor_id, actor_role, action_type, target_table, target_id, new_data
    ) VALUES (
        v_caller_uid,
        CASE WHEN v_is_admin THEN 'admin' ELSE 'traveler' END,
        'BLIND_BOOKING_REVEALED',
        'bookings',
        v_bk.booking_code,
        jsonb_build_object('revealed_at', v_bk.revealed_at)
    );

    SELECT * INTO v_pkg FROM public.packages WHERE id = v_bk.package_id;
    SELECT * INTO v_dest FROM public.destinations WHERE id = v_pkg.secret_destination_id;
    SELECT * INTO v_hotel FROM public.hotels WHERE id = v_pkg.secret_hotel_id;
    SELECT * INTO v_flight FROM public.flights WHERE id = v_pkg.secret_flight_id;

    RETURN jsonb_build_object(
        'booking_code', v_bk.booking_code,
        'status', v_bk.status,
        'revealed_at', v_bk.revealed_at,
        'destination', jsonb_build_object(
            'city_name', v_dest.city_name,
            'province_name', v_dest.province_name,
            'region', v_dest.region,
            'local_dining_guide', v_dest.local_dining_guide_jsonb
        ),
        'hotel', jsonb_build_object(
            'hotel_name', v_hotel.hotel_name,
            'address', v_hotel.address,
            'star_rating', v_hotel.star_rating,
            'sla_code', v_hotel.sla_code,
            'hero_image_url', v_hotel.secret_hero_image_url
        ),
        'flight', jsonb_build_object(
            'airline_name', v_flight.airline_name,
            'flight_code', v_flight.flight_code,
            'origin_airport', v_flight.origin_airport,
            'destination_airport', v_flight.destination_airport,
            'exact_departure_time', v_flight.exact_departure_time,
            'baggage_kg', v_flight.baggage_kg
        )
    );
END;
$$;

REVOKE ALL ON FUNCTION public.reveal_blind_booking_v4(VARCHAR) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reveal_blind_booking_v4(VARCHAR) TO authenticated, service_role;

-- ============================================================================
-- 9. USER-CALLABLE RPC: request_refund_v4 (Phase 1 of Refund Lifecycle)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.request_refund_v4(
    p_booking_code VARCHAR,
    p_mode VARCHAR,
    p_tier VARCHAR,
    p_reason TEXT DEFAULT NULL,
    p_evidence_url TEXT DEFAULT NULL,
    p_idempotency_key VARCHAR DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_caller_uid UUID := auth.uid();
    v_bk public.bookings%ROWTYPE;
    v_pay public.payments%ROWTYPE;
    v_effective_tier VARCHAR(30);
    v_fee_rate NUMERIC(5,2);
    v_partner_rate NUMERIC(5,2);
    v_fee_vnd BIGINT;
    v_partner_vnd BIGINT;
    v_refund_vnd BIGINT;
    v_refund public.refunds%ROWTYPE;
BEGIN
    IF v_caller_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Login required.' USING ERRCODE = '28000';
    END IF;

    SELECT * INTO v_bk FROM public.bookings WHERE booking_code = p_booking_code FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Booking not found.' USING ERRCODE = 'P0002';
    END IF;

    IF v_bk.user_id <> v_caller_uid THEN
        RAISE EXCEPTION 'FORBIDDEN: Only the booking owner can request a refund.' USING ERRCODE = '42501';
    END IF;

    IF v_bk.paid_amount_vnd <= 0 OR v_bk.status IN ('PENDING_PAYMENT', 'EXPIRED', 'REFUNDED') THEN
        RAISE EXCEPTION 'CONFLICT: Booking has no refundable balance (status=%).', v_bk.status USING ERRCODE = '23505';
    END IF;

    SELECT * INTO v_pay FROM public.payments WHERE booking_id = v_bk.id FOR UPDATE;

    -- Normalize tier aliases and enforce post-reveal / hold-conflict tier overrides
    v_effective_tier := CASE
        WHEN p_tier IN ('FORCE_MAJEURE', 'FORCE_MAJEURE_A') THEN 'FORCE_MAJEURE'
        WHEN p_tier IN ('WINDOW_24_72H', 'LATE_24_72H') THEN 'WINDOW_24_72H'
        WHEN p_tier = 'EARLY_72H' THEN 'EARLY_72H'
        WHEN p_tier = 'HOLD_CONFLICT_FULL' THEN 'HOLD_CONFLICT_FULL'
        ELSE 'LATE_OR_REVEALED'
    END;

    IF v_bk.status = 'PAID_HOLD_CONFLICT' THEN
        v_effective_tier := 'HOLD_CONFLICT_FULL';
        v_fee_rate := 0.00; v_partner_rate := 0.00;
    ELSIF v_bk.is_revealed AND v_effective_tier <> 'FORCE_MAJEURE' THEN
        v_effective_tier := 'LATE_OR_REVEALED';
        v_fee_rate := 1.00; v_partner_rate := 0.75;
    ELSIF v_effective_tier = 'EARLY_72H' OR v_effective_tier = 'FORCE_MAJEURE' THEN
        v_fee_rate := 0.10; v_partner_rate := 0.00;
    ELSIF v_effective_tier = 'WINDOW_24_72H' THEN
        v_fee_rate := 0.35; v_partner_rate := 0.25;
    ELSE
        v_effective_tier := 'LATE_OR_REVEALED';
        v_fee_rate := 1.00; v_partner_rate := 0.75;
    END IF;

    v_fee_vnd := ROUND(v_bk.paid_amount_vnd * v_fee_rate);
    v_partner_vnd := ROUND(v_bk.paid_amount_vnd * v_partner_rate);
    v_refund_vnd := GREATEST(0, v_bk.paid_amount_vnd - v_fee_vnd);

    IF p_mode = 'QUOTE' THEN
        RETURN jsonb_build_object(
            'mode', 'QUOTE',
            'booking_code', v_bk.booking_code,
            'tier_applied', v_effective_tier,
            'paid_snapshot_vnd', v_bk.paid_amount_vnd,
            'cancellation_fee_vnd', v_fee_vnd,
            'partner_comp_vnd', v_partner_vnd,
            'refund_amount_vnd', v_refund_vnd
        );
    END IF;

    INSERT INTO public.refunds (
        booking_id, payment_id, requested_by, idempotency_key,
        tier_applied, paid_snapshot_vnd, cancellation_fee_vnd,
        partner_comp_vnd, refund_amount_vnd, reason, evidence_url,
        status, requested_at
    ) VALUES (
        v_bk.id, v_pay.id, v_caller_uid,
        COALESCE(p_idempotency_key, 'REQ-' || v_bk.booking_code || '-' || extract(epoch from now())::bigint),
        v_effective_tier, v_bk.paid_amount_vnd, v_fee_vnd,
        v_partner_vnd, v_refund_vnd, p_reason, p_evidence_url,
        'REQUESTED', NOW()
    ) RETURNING * INTO v_refund;

    INSERT INTO public.booking_status_history (
        booking_id, from_booking_status, to_booking_status, changed_by, reason
    ) VALUES (
        v_bk.id, v_bk.status, 'REFUND_REQUESTED', v_caller_uid, 'Traveler submitted refund request ' || v_refund.id
    );

    UPDATE public.bookings SET status = 'REFUND_REQUESTED', updated_at = NOW() WHERE id = v_bk.id;

    RETURN jsonb_build_object(
        'mode', 'REQUEST',
        'refund_id', v_refund.id,
        'tier_applied', v_refund.tier_applied,
        'status', v_refund.status,
        'cancellation_fee_vnd', v_refund.cancellation_fee_vnd,
        'refund_amount_vnd', v_refund.refund_amount_vnd
    );
END;
$$;

REVOKE ALL ON FUNCTION public.request_refund_v4(VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, VARCHAR) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_refund_v4(VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, VARCHAR) TO authenticated, service_role;

-- ============================================================================
-- 10. ADMIN-ONLY RPC: approve_refund_v4 (Phase 2 of Refund Lifecycle)
-- Transitions to APPROVED and writes REFUND_PAYOUT_REQUESTED to outbox_events.
-- NEVER calls external bank API or releases inventory holds prematurely!
-- ============================================================================
CREATE OR REPLACE FUNCTION public.approve_refund_v4(
    p_refund_id UUID,
    p_decision VARCHAR,
    p_review_note TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_caller_uid UUID := auth.uid();
    v_ref public.refunds%ROWTYPE;
    v_bk public.bookings%ROWTYPE;
BEGIN
    IF NOT public.is_admin(v_caller_uid) THEN
        RAISE EXCEPTION 'FORBIDDEN: Admin privilege required.' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_ref FROM public.refunds WHERE id = p_refund_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Refund not found.' USING ERRCODE = 'P0002';
    END IF;

    IF v_ref.status IN ('APPROVED', 'PROCESSING', 'SUCCEEDED') AND p_decision = 'APPROVE' THEN
        RETURN jsonb_build_object('refund_id', v_ref.id, 'status', v_ref.status, 'idempotent_replay', TRUE);
    END IF;

    IF v_ref.status <> 'REQUESTED' THEN
        RAISE EXCEPTION 'CONFLICT: Only REQUESTED refunds can be reviewed (current=%).', v_ref.status USING ERRCODE = '23505';
    END IF;

    SELECT * INTO v_bk FROM public.bookings WHERE id = v_ref.booking_id FOR UPDATE;

    IF p_decision = 'REJECT' THEN
        UPDATE public.refunds
        SET status = 'REJECTED', reviewed_by = v_caller_uid, reviewed_at = NOW(),
            reason = COALESCE(p_review_note, reason), updated_at = NOW()
        WHERE id = v_ref.id;

        UPDATE public.bookings
        SET status = CASE
            WHEN is_revealed THEN 'REVEALED'
            WHEN paid_amount_vnd > expected_amount_vnd THEN 'OVERPAID'
            ELSE 'PAID'
        END, updated_at = NOW()
        WHERE id = v_bk.id;

        RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'REJECTED');
    END IF;

    UPDATE public.refunds
    SET status = 'APPROVED', reviewed_by = v_caller_uid, reviewed_at = NOW(), updated_at = NOW()
    WHERE id = v_ref.id
    RETURNING * INTO v_ref;

    UPDATE public.bookings
    SET status = 'REFUND_APPROVED', updated_at = NOW()
    WHERE id = v_bk.id;

    INSERT INTO public.booking_status_history (
        booking_id, from_booking_status, to_booking_status, changed_by, reason
    ) VALUES (
        v_bk.id, v_bk.status, 'REFUND_APPROVED', v_caller_uid, 'Admin approved refund ' || v_ref.id
    );

    INSERT INTO public.outbox_events (
        aggregate_type, aggregate_id, event_type, idempotency_key, payload
    ) VALUES (
        'REFUND', v_ref.id, 'REFUND_PAYOUT_REQUESTED',
        'OUTBOX-PAYOUT-' || v_ref.idempotency_key,
        jsonb_build_object(
            'refund_id', v_ref.id,
            'booking_id', v_bk.id,
            'booking_code', v_bk.booking_code,
            'user_id', v_bk.user_id,
            'refund_amount_vnd', v_ref.refund_amount_vnd,
            'idempotency_key', v_ref.idempotency_key
        )
    ) ON CONFLICT (idempotency_key) DO NOTHING;

    INSERT INTO public.audit_logs (
        actor_id, actor_role, action_type, target_table, target_id, new_data
    ) VALUES (
        v_caller_uid, 'admin', 'REFUND_APPROVED', 'refunds', v_ref.id::VARCHAR,
        jsonb_build_object('booking_code', v_bk.booking_code, 'refund_amount_vnd', v_ref.refund_amount_vnd)
    );

    RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'APPROVED', 'outbox_queued', TRUE, 'idempotent_replay', FALSE);
END;
$$;

REVOKE ALL ON FUNCTION public.approve_refund_v4(UUID, VARCHAR, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_refund_v4(UUID, VARCHAR, TEXT) TO authenticated, service_role;

-- ============================================================================
-- 11. SERVICE-ROLE RPCs: claim_refund_for_processing_v4 & finalize_refund_payout_v4
-- (Phase 3 & Phase 4 of Refund Lifecycle)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.claim_refund_for_processing_v4(p_refund_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_ref public.refunds%ROWTYPE;
    v_bk public.bookings%ROWTYPE;
BEGIN
    SELECT * INTO v_ref FROM public.refunds WHERE id = p_refund_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Refund not found.' USING ERRCODE = 'P0002';
    END IF;

    IF v_ref.status = 'RECONCILIATION_REQUIRED' THEN
        RAISE EXCEPTION 'RECONCILIATION_LOCKED: Refund % is awaiting bank status reconciliation; duplicate payout blocked.', v_ref.id
            USING ERRCODE = '23505';
    END IF;

    IF v_ref.status <> 'APPROVED' THEN
        RAISE EXCEPTION 'CONFLICT: Only APPROVED refunds can be claimed for payout processing (current=%).', v_ref.status
            USING ERRCODE = '23505';
    END IF;

    SELECT * INTO v_bk FROM public.bookings WHERE id = v_ref.booking_id FOR UPDATE;

    UPDATE public.refunds SET status = 'PROCESSING', updated_at = NOW() WHERE id = v_ref.id;
    UPDATE public.bookings SET status = 'REFUND_PROCESSING', updated_at = NOW() WHERE id = v_bk.id;

    RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'PROCESSING', 'idempotency_key', v_ref.idempotency_key);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_refund_for_processing_v4(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_refund_for_processing_v4(UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.finalize_refund_payout_v4(
    p_refund_id UUID,
    p_outcome VARCHAR,
    p_payout_bank_ref VARCHAR DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_ref public.refunds%ROWTYPE;
    v_bk public.bookings%ROWTYPE;
    v_hold RECORD;
BEGIN
    SELECT * INTO v_ref FROM public.refunds WHERE id = p_refund_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Refund not found.' USING ERRCODE = 'P0002';
    END IF;

    IF v_ref.status = 'SUCCEEDED' THEN
        RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'SUCCEEDED', 'idempotent_replay', TRUE);
    END IF;

    SELECT * INTO v_bk FROM public.bookings WHERE id = v_ref.booking_id FOR UPDATE;

    IF p_outcome = 'RECONCILIATION_REQUIRED' THEN
        UPDATE public.refunds
        SET status = 'RECONCILIATION_REQUIRED', failure_reason = p_error_message, updated_at = NOW()
        WHERE id = v_ref.id;

        UPDATE public.bookings
        SET status = 'REFUND_RECONCILIATION_REQUIRED', updated_at = NOW()
        WHERE id = v_bk.id;

        RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'RECONCILIATION_REQUIRED');
    END IF;

    IF p_outcome = 'FAILED' THEN
        UPDATE public.refunds
        SET status = 'FAILED', failure_reason = p_error_message, updated_at = NOW()
        WHERE id = v_ref.id;

        UPDATE public.bookings
        SET status = 'REFUND_APPROVED', updated_at = NOW()
        WHERE id = v_bk.id;

        RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'FAILED');
    END IF;

    -- Outcome = 'SUCCEEDED': Release inventory holds ONCE and record outflow transaction
    FOR v_hold IN
        SELECT * FROM public.inventory_holds
        WHERE booking_id = v_bk.id AND hold_status IN ('HELD', 'COMMITTED')
        ORDER BY inventory_id ASC
        FOR UPDATE
    LOOP
        UPDATE public.inventory_holds
        SET hold_status = 'RELEASED', released_at = NOW(), updated_at = NOW()
        WHERE id = v_hold.id AND hold_status IN ('HELD', 'COMMITTED');

        IF FOUND THEN
            UPDATE public.partner_inventories
            SET available_slots = available_slots + v_hold.quantity,
                reserved_slots = GREATEST(0, reserved_slots - v_hold.quantity),
                updated_at = NOW()
            WHERE id = v_hold.inventory_id;
        END IF;
    END LOOP;

    INSERT INTO public.payment_transactions (
        payment_id, booking_id, payment_provider, external_transaction_id,
        amount_vnd, direction, transfer_content
    ) VALUES (
        v_ref.payment_id, v_bk.id, 'NAPAS_PAYOUT',
        COALESCE(p_payout_bank_ref, 'REF-PAYOUT-' || v_ref.idempotency_key),
        v_ref.refund_amount_vnd, 'OUTFLOW_REFUND',
        'Refund payout for ' || v_bk.booking_code
    ) ON CONFLICT (payment_provider, external_transaction_id) DO NOTHING;

    UPDATE public.refunds
    SET status = 'SUCCEEDED',
        payout_bank_ref = p_payout_bank_ref,
        processed_at = NOW(),
        updated_at = NOW()
    WHERE id = v_ref.id;

    UPDATE public.payments
    SET refunded_amount_vnd = refunded_amount_vnd + v_ref.refund_amount_vnd,
        payment_status = CASE
            WHEN refunded_amount_vnd + v_ref.refund_amount_vnd >= paid_amount_vnd THEN 'REFUNDED'
            ELSE 'PARTIALLY_REFUNDED'
        END,
        updated_at = NOW()
    WHERE id = v_ref.payment_id;

    UPDATE public.bookings
    SET status = 'REFUNDED', updated_at = NOW()
    WHERE id = v_bk.id;

    UPDATE public.outbox_events
    SET status = 'PUBLISHED', processed_at = NOW()
    WHERE idempotency_key = 'OUTBOX-PAYOUT-' || v_ref.idempotency_key;

    RETURN jsonb_build_object('refund_id', v_ref.id, 'status', 'SUCCEEDED', 'idempotent_replay', FALSE);
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_refund_payout_v4(UUID, VARCHAR, VARCHAR, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_refund_payout_v4(UUID, VARCHAR, VARCHAR, TEXT) TO service_role;

-- ============================================================================
-- 12. SERVICE-ROLE RPC: claim_due_outbox_events_v4
-- Atomically claims due PENDING or stale-locked PROCESSING outbox events using
-- FOR UPDATE SKIP LOCKED (prevents duplicate worker execution and recovers after crash).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.claim_due_outbox_events_v4(
    p_worker_id VARCHAR,
    p_batch_limit INT DEFAULT 20,
    p_lease_seconds INT DEFAULT 30
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_evt public.outbox_events%ROWTYPE;
    v_claimed JSONB := '[]'::jsonb;
BEGIN
    FOR v_evt IN
        SELECT * FROM public.outbox_events
        WHERE (
            (status = 'PENDING' AND next_attempt_at <= NOW() AND (locked_until IS NULL OR locked_until <= NOW()))
            OR
            (status = 'PROCESSING' AND locked_until IS NOT NULL AND locked_until <= NOW())
        )
        ORDER BY next_attempt_at ASC
        LIMIT p_batch_limit
        FOR UPDATE SKIP LOCKED
    LOOP
        -- Skip REFUND_PAYOUT_REQUESTED if the underlying refund is locked in RECONCILIATION_REQUIRED
        IF v_evt.event_type = 'REFUND_PAYOUT_REQUESTED' AND EXISTS (
            SELECT 1 FROM public.refunds r
            WHERE r.id = v_evt.aggregate_id
              AND r.status = 'RECONCILIATION_REQUIRED'
        ) THEN
            CONTINUE;
        END IF;

        UPDATE public.outbox_events
        SET status = 'PROCESSING',
            locked_by = COALESCE(NULLIF(trim(p_worker_id), ''), 'outbox-worker'),
            locked_until = NOW() + make_interval(secs => GREATEST(5, p_lease_seconds))
        WHERE id = v_evt.id
        RETURNING * INTO v_evt;

        v_claimed := v_claimed || jsonb_build_array(to_jsonb(v_evt));
    END LOOP;

    RETURN jsonb_build_object(
        'claimed_count', jsonb_array_length(v_claimed),
        'events', v_claimed
    );
END;
$$;

REVOKE ALL ON FUNCTION public.claim_due_outbox_events_v4(VARCHAR, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_due_outbox_events_v4(VARCHAR, INT, INT) TO service_role;

-- ============================================================================
-- 14. SERVICE-ROLE RPC: persist_recommendation_session_v4
-- Atomically persists recommendation session, sealed packages, and package_items
-- into PostgreSQL so subsequent create_booking_with_hold_v4 can lock and reference them.
-- ============================================================================
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
    v_pkg JSONB;
    v_item JSONB;
BEGIN
    INSERT INTO public.recommendation_sessions (
        id, user_id, origin_airport, budget_per_person_vnd, group_size,
        departure_date, duration_days, trip_purpose,
        vec_healing, vec_nature, vec_solitude, vec_comfort, vec_culture,
        blacklisted_city_slugs, comfort_locks, ai_archetype_label, created_at
    ) VALUES (
        (p_session->>'id')::UUID,
        (p_session->>'user_id')::UUID,
        COALESCE(p_session->>'origin_airport', 'SGN'),
        (p_session->>'budget_per_person_vnd')::BIGINT,
        (p_session->>'group_size')::SMALLINT,
        (p_session->>'departure_date')::DATE,
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
            (v_pkg->>'user_id')::UUID,
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
        INSERT INTO public.package_items (
            id, package_id, inventory_id, item_type, units_required, unit_snapshot_price_vnd
        ) VALUES (
            (v_item->>'id')::UUID,
            (v_item->>'package_id')::UUID,
            (v_item->>'inventory_id')::UUID,
            v_item->>'item_type',
            (v_item->>'units_required')::SMALLINT,
            (v_item->>'unit_snapshot_price_vnd')::BIGINT
        ) ON CONFLICT (id) DO NOTHING;
    END LOOP;

    RETURN jsonb_build_object('success', TRUE);
END;
$$;

REVOKE ALL ON FUNCTION public.persist_recommendation_session_v4(JSONB, JSONB, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.persist_recommendation_session_v4(JSONB, JSONB, JSONB) TO service_role;



