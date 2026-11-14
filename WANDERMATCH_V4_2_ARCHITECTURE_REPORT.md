# WANDERMATCH V4.2 — ARCHITECTURE REPORT

**Date:** 2026-11-14  
**Branch:** `feat/v4-architecture`  
**Baseline Backup:** `backup/pre-v4-2-recovery` (`480b114aee183e4dad37a5028817791266f663cf`)  
**Target Platform Stack:** GitHub + Supabase (`wandermatch-v4-staging` / `hpwtdlffidfircparanl`) + Cloudflare Workers (`wandermatch-api-staging`) + Vercel (`wandermatch-v4`)

---

## 1. Executive Architectural Overview

WanderMatch V4.2 completes the recovery, modular refactoring, and environment isolation of the V4 architecture while leaving the V3 Production environment untouched. Every layer now enforces explicit environment boundaries and clear separation between routing, middleware, domain business controllers, PostgreSQL RPC execution, and frontend modular bindings.

### 4-Platform Topology (Staging)

| Platform | Component / Identifier | Branch / Endpoint | Status |
|---|---|---|---|
| **GitHub** | `Edtech-dev-design/wandermatch-v3` | `feat/v4-architecture` (`104f38db387aeafbc33ac40c943284ec54aa6b0c`) | Active, CI Run `43574663629` passed |
| **Supabase (Staging)** | `wandermatch-v4-staging` (`hpwtdlffidfircparanl`) | `https://hpwtdlffidfircparanl.supabase.co` | 7/7 migrations applied (`20261025000001`..`20261114000005`) |
| **Cloudflare Workers (Staging)** | `wandermatch-api-staging` (Entry: `src/index.js`) | `https://wandermatch-api-staging.vannong20182018.workers.dev` | Deployed Version ID `e284cf25-163c-43dc-9528-77d44878c509` |
| **Vercel (Staging Preview)** | `wandermatch-v4` (`outputDirectory: "frontend"`) | `https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app` | Protected by Vercel SSO Deployment Protection |

---

## 2. Backend Modular Architecture (`src/`)

Both `wrangler.toml` and `worker/wrangler.toml` now point `main` to the canonical modular entrypoint `src/index.js`, eliminating split-brain drift between `worker.js` and `src/`.

### Request Execution Pipeline (`src/index.js`)
1. **Request Tracing & Logging**: Assigns `X-Request-Id` (`generateRequestId`) and initializes `createStructuredLogger(env, requestId)`.
2. **Environment Isolation Guard**: Calls `enforceEnvironmentIsolation(env, { path: url.pathname, requestId })` *before* CORS, storage hydration, or any Supabase call. Fails closed (`503 ENV_ISOLATION_VIOLATION` / `PRODUCTION_KEY_IN_STAGING_BLOCKED`) if `ENVIRONMENT` is missing or if a non-production runtime references Production ref `iwuehabwpihnpahuhqki`.
3. **CORS Enforcement**: Validates request origin via `resolveCorsHeaders(request, env)` from `src/middleware/corsMiddleware.js`, blocking unauthorized `/api/v4/*` origins (`403 CORS_ORIGIN_DENIED`) while preserving server-to-server webhook delivery (`/api/v4/webhooks/payment`).
4. **Sliding-Window Rate Limiting**: Evaluates `checkRateLimit(request)` (`src/middleware/rateLimitMiddleware.js`), returning `429 RATE_LIMIT_EXCEEDED` with `Retry-After` when exceeded.
5. **Transactional Lock & Incremental Router Dispatch**:
   - Acquires `withStorageLock` and hydrates Worker state snapshot (`hydrate(env)`).
   - Dispatches `/api/v4/*` endpoints through `dispatchV4Route` (`src/router/apiRouter.js`), preserving all 11 `V41_ROUTE_REGISTRY` keys alongside `V42_ROUTE_REGISTRY` (25 endpoints total).
   - Falls back to legacy `/api/*` compatibility handlers in `worker.js` (`legacyHandler.fetch`) without duplicating core auth or storage locks.
   - Rolls back in-memory `STORAGE` on unhandled exceptions using `cloneSnapshot(STORAGE)` and attaches `X-Request-Id` + `X-Environment` tracing headers.

### Backend Domain Modules & Services

| Layer | File(s) | Responsibilities |
|---|---|---|
| **Router** | `src/router/apiRouter.js` | `V41_ROUTE_REGISTRY`, `V42_ROUTE_REGISTRY`, `dispatchV4Route`, canonical error status resolution (`401`/`402`/`403`/`404`/`409`/`410`/`422`/`500`) |
| **Middleware** | `src/middleware/envIsolationGuard.js`, `authMiddleware.js`, `corsMiddleware.js`, `rateLimitMiddleware.js` | 3-tier runtime isolation, bearer JWT/session verification, strict CORS, rate limiting |
| **Domain Controllers** | `src/modules/auth/authController.js`, `users/usersController.js`, `discovery/discoveryController.js`, `blind-booking/blindBookingController.js`, `booking/bookingController.js`, `payment/paymentController.js`, `reviews/reviewsController.js`, `notifications/notificationsController.js`, `admin/adminController.js` | Isolated business controllers for GoTrue auth/profile sync, catalog & recommendations, sealed packages & reveal gating, booking holds & status, payment webhooks & refunds, reviews, notifications, reconciliation, and cutover controls |
| **AI Service & Engine** | `src/modules/ai/aiCoPilotService.js`, `src/engines/recommendationEngine.js` | Resilient AI co-pilot fallback, k-anonymity (`k >= 3`) recommendation pooling, zero pre-reveal secret projection |
| **Data & RPC Layer** | `src/services/supabase/postgresRpcClient.js`, `src/services/v4RelationalEngine.js`, `src/services/external/externalServices.js` | `invokePostgresRpc` (PostgREST RPC + GoTrue JWT validation + `P0001` HTTP status mapping), `selectPostgresRows`, `insertPostgresRows`, `deterministicUuidV4`, dynamic-date inventory provisioning, dual local harness |
| **Security & Utils** | `src/security/piiCrypto.js`, `src/utils/logger.js`, `src/utils/sanitizePreReveal.js` | PII AES-GCM/HMAC utilities, secret redaction logger, pre-reveal payload stripping |

---

## 3. Database Architecture — PostgreSQL / Supabase (`supabase/migrations/`)

The relational core comprises 7 ordered migrations on `hpwtdlffidfircparanl`:
1. `20261025000001_wandermatch_v3_schema.sql` — Legacy V3 baseline schema.
2. `20261030000002_wm_worker_state.sql` — `public.wm_worker_state` table locked down from `PUBLIC, anon, authenticated`.
3. `20261105000001_v4_schema_27_tables.sql` — Normalized 27-table relational schema (`profiles`, `user_sensitive_pii`, `user_roles`, `user_preferences`, `destinations`, `travel_providers`, `hotels`, `flights`, `partner_inventories`, `recommendation_sessions`, `packages`, `package_items`, `bookings`, `booking_items`, `booking_travelers`, `inventory_holds`, `booking_status_history`, `payments`, `payment_webhook_events`, `payment_transactions`, `refunds`, `reviews`, `saved_packages`, `notifications`, `audit_logs`, `system_settings`, `outbox_events`) with composite FKs, unique idempotency keys, and state-machine triggers.
4. `20261105000002_v4_rls_and_privileges.sql` — Strict RLS across all 27 tables; zero table grants for `anon`/`authenticated` on `user_sensitive_pii`; reveal-gated `booking_items` RLS.
5. `20261105000003_v4_atomic_rpcs.sql` — `SECURITY DEFINER` atomic transactional RPCs (`create_booking_with_hold_v4`, `process_payment_webhook_v4`, `reveal_blind_booking_v4`, `request_refund_v4`, `review_refund_v4`, `claim_refund_for_processing_v4`, `finalize_refund_payout_v4`, `persist_recommendation_session_v4`, etc.).
6. `20261105000004_v4_seed_and_reconciliation.sql` — Seed destinations/hotels/flights/inventories and 7 financial reconciliation checks (`run_v4_reconciliation_checks`).
7. `20261114000005_v4_2_security_and_profile_sync.sql` (V4.2 Migration):
   - **`handle_new_auth_user_v4` + trigger `trg_on_auth_user_created_v4`** on `auth.users`: Automatically synchronizes new GoTrue signups into `public.profiles`, `public.user_roles`, and `public.user_preferences`, plus backfills pre-existing users to prevent `23503` FK violations on `recommendation_sessions`.
   - **`ensure_user_profile_v4`** (`service_role` RPC): Deterministic user/profile synchronization.
   - **`ensure_inventory_for_date_v4`** (`service_role` RPC): Provisions `partner_inventories` dynamically for any requested future `departure_date` so future travel dates do not starve blind package matching.
   - **`persist_recommendation_session_v4`**: Updated 3-arg signature storing server-sealed `packages` and `package_items`.
   - **`is_admin` & `is_super_admin` hardening**: Revoked from `PUBLIC`/`anon`, added anti-enumeration caller checks for `authenticated`.
   - **Reviews & Notifications RPCs**: `submit_review_v4`, `get_my_notifications_v4`, and `mark_notification_read_v4`.

---

## 4. Frontend Modular Architecture (`frontend/`)

`frontend/index.html` loads `<script type="module" src="core/bootstrapV4.js"></script>` prior to `app.js?v=14.2`, genuinely instantiating all 10 domain modules onto `window.WM_V4`:

- **Environment & Core**: `frontend/config/environments.js`, `frontend/core/appCore.js`, `frontend/services/apiClient.js`, `frontend/core/bootstrapV4.js` (`initFrontendAppV4`, `readActiveAccessToken`, `syncSessionToken`).
- **10 Domain Modules**:
  1. `auth` (`frontend/modules/auth/authModule.js`)
  2. `profile` (`frontend/modules/profile/profileModule.js`)
  3. `discovery` (`frontend/modules/discovery/discoveryModule.js`)
  4. `ai` (`frontend/modules/ai/aiRecommendationModule.js`)
  5. `blindBooking` (`frontend/modules/blind-booking/blindBookingModule.js`)
  6. `booking` (`frontend/modules/booking/bookingModule.js`)
  7. `payment` (`frontend/modules/payment/paymentModule.js`)
  8. `reviews` (`frontend/modules/reviews/reviewsModule.js`)
  9. `notifications` (`frontend/modules/notifications/notificationsModule.js`)
  10. `admin` (`frontend/modules/admin/adminModule.js`)
- Root `index.html`, `app.js`, and `supabaseClient.js` are kept synchronized with `frontend/`. Zero `service_role` keys exist in any browser file.
