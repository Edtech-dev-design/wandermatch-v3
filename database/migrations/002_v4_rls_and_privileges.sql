-- ============================================================================
-- WANDERMATCH V4.0 – MIGRATION 002: ROW LEVEL SECURITY (RLS) & TABLE PRIVILEGES
-- Enforces strict RLS on all 27 tables + REVOKE ALL on user_sensitive_pii & outbox_events
-- ============================================================================

-- 1. ENABLE RLS ON ALL 27 TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sensitive_pii ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_events ENABLE ROW LEVEL SECURITY;

-- 2. STRICT TABLE-LEVEL PRIVILEGE ISOLATION FOR PII VAULT & TRANSACTIONAL OUTBOX
REVOKE ALL ON TABLE public.user_sensitive_pii FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.user_sensitive_pii TO service_role;

REVOKE ALL ON TABLE public.outbox_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.outbox_events TO service_role;

REVOKE ALL ON TABLE public.payment_webhook_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.payment_webhook_events TO service_role;

-- 3. RLS POLICIES FOR ALL 27 TABLES

-- #1. profiles
DROP POLICY IF EXISTS pol_profiles_select ON public.profiles;
CREATE POLICY pol_profiles_select ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS pol_profiles_update ON public.profiles;
CREATE POLICY pol_profiles_update ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- #2. user_sensitive_pii (No policies granted to anon/authenticated; service_role only + get_my_masked_pii_v4 RPC)

-- #3. user_roles
DROP POLICY IF EXISTS pol_roles_select ON public.user_roles;
CREATE POLICY pol_roles_select ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS pol_roles_super_admin_all ON public.user_roles;
CREATE POLICY pol_roles_super_admin_all ON public.user_roles FOR ALL
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- #4. user_preferences
DROP POLICY IF EXISTS pol_prefs_owner_all ON public.user_preferences;
CREATE POLICY pol_prefs_owner_all ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id);

-- #5. destinations (Locked from direct client SELECT to prevent catalog scraping)
DROP POLICY IF EXISTS pol_destinations_admin_all ON public.destinations;
CREATE POLICY pol_destinations_admin_all ON public.destinations FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- #6. travel_providers
DROP POLICY IF EXISTS pol_providers_select ON public.travel_providers;
CREATE POLICY pol_providers_select ON public.travel_providers FOR SELECT
  USING (auth.uid() = owner_user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS pol_providers_update ON public.travel_providers;
CREATE POLICY pol_providers_update ON public.travel_providers FOR UPDATE
  USING (auth.uid() = owner_user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = owner_user_id OR public.is_admin(auth.uid()));

-- #7. hotels (Locked from travelers; visible only to owning B2B partner & Admin)
DROP POLICY IF EXISTS pol_hotels_partner_admin ON public.hotels;
CREATE POLICY pol_hotels_partner_admin ON public.hotels FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = auth.uid())
  );

-- #8. flights (Locked from travelers; visible only to owning B2B partner & Admin)
DROP POLICY IF EXISTS pol_flights_partner_admin ON public.flights;
CREATE POLICY pol_flights_partner_admin ON public.flights FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = auth.uid())
  );

-- #9. partner_inventories
DROP POLICY IF EXISTS pol_inventories_partner_admin ON public.partner_inventories;
CREATE POLICY pol_inventories_partner_admin ON public.partner_inventories FOR ALL
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = auth.uid())
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.travel_providers tp WHERE tp.id = provider_id AND tp.owner_user_id = auth.uid())
  );

-- #10. recommendation_sessions
DROP POLICY IF EXISTS pol_rec_sessions_select ON public.recommendation_sessions;
CREATE POLICY pol_rec_sessions_select ON public.recommendation_sessions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- #11. packages (Direct table SELECT blocked for travelers to protect secret_* columns!)
DROP POLICY IF EXISTS pol_packages_admin_only ON public.packages;
CREATE POLICY pol_packages_admin_only ON public.packages FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- #12. package_items (Direct table SELECT blocked for travelers)
DROP POLICY IF EXISTS pol_package_items_admin_only ON public.package_items;
CREATE POLICY pol_package_items_admin_only ON public.package_items FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- #13. bookings
DROP POLICY IF EXISTS pol_bookings_select ON public.bookings;
CREATE POLICY pol_bookings_select ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- #14. booking_items (Post-Reveal Gatekeeper Policy!)
DROP POLICY IF EXISTS pol_booking_items_revealed_select ON public.booking_items;
CREATE POLICY pol_booking_items_revealed_select ON public.booking_items FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.user_id = auth.uid()
        AND b.is_revealed = TRUE
        AND b.status IN ('REVEALED', 'COMPLETED')
    )
  );

-- #15. booking_travelers
DROP POLICY IF EXISTS pol_travelers_select ON public.booking_travelers;
CREATE POLICY pol_travelers_select ON public.booking_travelers FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- #16. inventory_holds
DROP POLICY IF EXISTS pol_holds_select ON public.inventory_holds;
CREATE POLICY pol_holds_select ON public.inventory_holds FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- #17. booking_status_history
DROP POLICY IF EXISTS pol_bk_history_select ON public.booking_status_history;
CREATE POLICY pol_bk_history_select ON public.booking_status_history FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- #18. payments
DROP POLICY IF EXISTS pol_payments_select ON public.payments;
CREATE POLICY pol_payments_select ON public.payments FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- #19. payment_webhook_events (Admin only)
DROP POLICY IF EXISTS pol_webhooks_admin_select ON public.payment_webhook_events;
CREATE POLICY pol_webhooks_admin_select ON public.payment_webhook_events FOR SELECT
  USING (public.is_admin(auth.uid()));

-- #20. payment_transactions
DROP POLICY IF EXISTS pol_pay_tx_select ON public.payment_transactions;
CREATE POLICY pol_pay_tx_select ON public.payment_transactions FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- #21. refunds
DROP POLICY IF EXISTS pol_refunds_select ON public.refunds;
CREATE POLICY pol_refunds_select ON public.refunds FOR SELECT
  USING (auth.uid() = requested_by OR public.is_admin(auth.uid()));

-- #22. reviews
DROP POLICY IF EXISTS pol_reviews_public_select ON public.reviews;
CREATE POLICY pol_reviews_public_select ON public.reviews FOR SELECT
  USING (moderation_status = 'APPROVED' OR auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS pol_reviews_owner_insert ON public.reviews;
CREATE POLICY pol_reviews_owner_insert ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.user_id = auth.uid()
        AND b.status IN ('REVEALED', 'COMPLETED')
    )
  );

-- #23. saved_packages
DROP POLICY IF EXISTS pol_saved_pkg_owner_all ON public.saved_packages;
CREATE POLICY pol_saved_pkg_owner_all ON public.saved_packages FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- #24. notifications
DROP POLICY IF EXISTS pol_notif_owner_select ON public.notifications;
CREATE POLICY pol_notif_owner_select ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS pol_notif_owner_update ON public.notifications;
CREATE POLICY pol_notif_owner_update ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- #25. audit_logs
DROP POLICY IF EXISTS pol_audit_admin_select ON public.audit_logs;
CREATE POLICY pol_audit_admin_select ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

-- #26. system_settings
DROP POLICY IF EXISTS pol_settings_select ON public.system_settings;
CREATE POLICY pol_settings_select ON public.system_settings FOR SELECT
  USING (is_public = TRUE OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS pol_settings_super_admin_all ON public.system_settings;
CREATE POLICY pol_settings_super_admin_all ON public.system_settings FOR ALL
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- #27. outbox_events (Admin select only; mutations restricted to service_role)
DROP POLICY IF EXISTS pol_outbox_admin_select ON public.outbox_events;
CREATE POLICY pol_outbox_admin_select ON public.outbox_events FOR SELECT
  USING (public.is_admin(auth.uid()));

