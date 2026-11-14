# WANDERMATCH V4.2 — SECURITY AUDIT REPORT

**Date:** 2026-11-14  
**Scope:** Environment Isolation, Auth & Privilege Boundaries, RLS & PostgREST Hardening, Blind Booking Secrecy, Payment & Webhook Integrity, PII Vault Protection, Secret Hygiene.

---

## 1. Environment Isolation & Fail-Closed Guard

### Implementation
- **Backend**: `src/middleware/envIsolationGuard.js` (`enforceEnvironmentIsolation`, `validateRuntimeEnvironment`) executes at the top of `src/index.js` `fetch()` and inside `selectPostgresRows` / `insertPostgresRows` in `src/services/supabase/postgresRpcClient.js`.
- **Frontend**: `frontend/config/environments.js` (`ENVIRONMENT_MATRIX`, `resolveFrontendEnvironment`, `validateFrontendEnvironment`, `assertStagingNotConnectedToProduction`) and `frontend/supabaseClient.js` enforce strict 3-tier isolation (`development` / `staging` / `production`).
- **CI/CD**: `npm run verify:env` (`package.json`) verifies `wrangler.toml`, `worker/wrangler.toml`, and `supabase/config.toml` point only to `hpwtdlffidfircparanl` / `wandermatch-api-staging` / `src/index.js` and contain zero references to Production ref `iwuehabwpihnpahuhqki`.

### Security Guarantees Verified
| Control | Verification Result | Status |
|---|---|---|
| Missing or unrecognized `ENVIRONMENT` variable | Fails closed with HTTP `503 ENV_ISOLATION_VIOLATION` (`MISSING_OR_INVALID_ENVIRONMENT_IDENTITY`) | `VERIFIED_LOCAL` (`V4.2-02`) |
| Non-production `SUPABASE_URL` pointing to `iwuehabwpihnpahuhqki` | Blocked with HTTP `503 ENV_ISOLATION_VIOLATION` (`NON_PROD_CONNECTING_TO_PRODUCTION_SUPABASE`) | `VERIFIED_LOCAL` (`V4.1-01`, `V4.2-02`) |
| Production JWT key (`ref=iwuehabwpihnpahuhqki`) inside Staging Worker | Decoded pre-DB and blocked with HTTP `503 PRODUCTION_KEY_IN_STAGING_BLOCKED` | `VERIFIED_LOCAL` (`V4.1-02`, `V4.2-02`) |
| Production `service_role` key embedded in frontend config | `validateFrontendEnvironment` rejects `role === "service_role"` with `FRONTEND_SERVICE_ROLE_KEY_FORBIDDEN` | `VERIFIED_LOCAL` (`V4.2-04`) |
| Live Staging Worker runtime identity | `GET /api/v4/health` confirms `environment: "staging"`, `projectRef: "hpwtdlffidfircparanl"`, `rpcMode: "POSTGRES_REST_RPC"` | `VERIFIED_STAGING` (`LIVE-01`) |

---

## 2. Database & PostgREST Access Control Audit

### Hardened in Migration `20261114000005_v4_2_security_and_profile_sync.sql`
1. **Admin Helper Enumeration Protection**: `public.is_admin(UUID)` and `public.is_super_admin(UUID)` had `EXECUTE` revoked from `PUBLIC` and `anon`. Non-service-role callers in `authenticated` are restricted so `p_uid` must match `auth.uid()`, preventing arbitrary user-role probing.
2. **Auth -> Profile Synchronization**: `trg_on_auth_user_created_v4` (`handle_new_auth_user_v4`) ensures every Supabase Auth signup automatically receives matching `public.profiles`, `public.user_roles` (`traveler`), and `public.user_preferences` rows.

### Live Staging PostgREST Penetration Probes (`LIVE-04`)
Direct REST and RPC probes against `https://hpwtdlffidfircparanl.supabase.co/rest/v1/` confirmed:

| Target Endpoint / Table | Caller Role | Observed Result | Assessment |
|---|---|---|---|
| `GET /rest/v1/user_sensitive_pii?select=*` | `anon` | HTTP `401` | Zero table grants; blocked |
| `GET /rest/v1/user_sensitive_pii?select=*` | `authenticated` (`userA`) | HTTP `403` | Zero table grants; PII vault completely isolated |
| `GET /rest/v1/outbox_events?select=*` | `anon` | HTTP `401` | Blocked for anonymous callers |
| `GET /rest/v1/outbox_events?select=*` | `authenticated` (`userA`) | HTTP `200`, `0` rows (`[]`) | `pol_outbox_admin_select` RLS denies non-admin row visibility |
| `GET /rest/v1/packages?select=id,secret_destination_id` | `anon` | HTTP `401` | Blocked for anonymous callers |
| `GET /rest/v1/packages?select=id,secret_destination_id` | `authenticated` (`userA`) | HTTP `200`, `0` rows (`[]`) | `pol_packages_admin_only` RLS prevents direct secret column reads |
| `POST /rest/v1/rpc/is_admin` & `rpc/is_super_admin` | `anon` | HTTP `401` | Function `EXECUTE` revoked from `PUBLIC` and `anon` |

> **Audit Observation:** Direct non-admin `authenticated` queries to `outbox_events` and `packages` currently return HTTP `200 []` (empty set enforced by RLS) rather than HTTP `403` because `20261105000002_v4_rls_and_privileges.sql` retains `GRANT SELECT` to `authenticated` on those tables for admin dashboard RLS filtering. Zero unauthorized rows or secret columns are exposed. If `403` at the PostgreSQL GRANT layer is desired in a future release, move admin inspection solely behind Worker `service_role` endpoints and revoke `SELECT` on `outbox_events` and `packages` from `authenticated`.

---

## 3. Application Authorization, Blind Reveal Secrecy & Payment Security

1. **Blind Booking Zero Pre-Reveal Leak**:
   - Verified in `LIVE-03` (`POST /api/v4/recommendations`) and `LIVE-04` (`GET /api/v4/packages/sealed`): payloads exclude `secret_destination_id`, `secret_hotel_id`, `secret_flight_id`, `city_name`, and `hotel_name`.
   - Verified in `LIVE-06`: Calling `POST /api/v4/bookings/reveal` on unpaid `WM20260017` returns **HTTP `402`** (`PAYMENT_REQUIRED`), enabled by our V4.2 fix in `src/services/supabase/postgresRpcClient.js` mapping PostgREST `P0001` prefixes (`PAYMENT_REQUIRED:` / `PAYMENT_RECONCILIATION_FAILED:` -> `402`, `HOLD_CONFLICT:` / `INSUFFICIENT_INVENTORY:` -> `409`, `GONE:` -> `410`).
2. **Cross-Tenant Isolation**:
   - Verified in `LIVE-09` and `LIVE-12`: User B attempting `GET /api/v4/bookings/status`, `POST /api/v4/bookings/reveal`, or booking User A's sealed package receives **HTTP `403`**.
   - Verified in `LIVE-13`: Non-admin User A calling `/api/v4/reconciliation` or `POST /api/v4/refunds/approve` receives **HTTP `403`**.
3. **HMAC-SHA256 Webhook Verification & Idempotency**:
   - Verified in `LIVE-07`: Forged `x-sepay-signature` rejected with **HTTP `401`**.
   - Verified in `LIVE-08`: Valid HMAC-SHA256 webhook transitions booking to `PAID`, and identical replay returns `200` with `idempotent_replay: true` without double-crediting.
4. **Concurrency & Double-Booking Prevention**:
   - Verified in `LIVE-12`: Concurrent `Promise.all` booking requests from User A on the same sealed package produce `uniqueCodesCreated: 1` (`WM20260018`), while concurrent User B contention is rejected (`403`).
5. **Frontend Auth Header Fix**:
   - Fixed `submitSlaRefundTicket` in `frontend/app.js` (and `app.js`) to attach `window.getAuthHeaders()` rather than unauthenticated `fetch()`.

---

## 4. Operational Notes & Secret Hygiene

- **Wrangler Staging Secrets**: `PAYMENT_WEBHOOK_SECRET` (fresh 32-byte hex), `SESSION_SECRET`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` were provisioned directly via Wrangler secret storage; zero plaintext secrets were committed to Git or left in source code.
- **Temporary Test Secret Cleanup**: Temporary scratch secret file `.staging_webhook_secret` used during live HMAC webhook E2E was deleted immediately after E2E completion (`Test-Path` verified `False`).
- **GoTrue Signup Email Quota Note (`LIVE-02`)**: During live Staging E2E runs, `POST /api/v4/auth/register` hit Supabase free-tier email rate limiting (`429 email rate limit exceeded`) when creating throwaway users in rapid succession. Live E2E validated GoTrue user creation + `trg_on_auth_user_created_v4` + OTP verification cleanly, and admin-configured custom SMTP is recommended prior to Staging load testing.
