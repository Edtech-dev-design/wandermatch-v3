# WANDERMATCH V4.2 — CHANGELOG

**Branch:** `feat/v4-architecture`  
**Baseline Commit:** `480b114aee183e4dad37a5028817791266f663cf` (`backup/pre-v4-2-recovery`)  
**Commits Included:** `4eac22b`, `48cea1f`, `104f38d` + V4.2 Deliverable Reports

---

## 1. Environment Isolation & Configuration

- **`src/middleware/envIsolationGuard.js`** *(Added)*: Fail-closed 3-tier (`development` / `staging` / `production`) runtime validation (`enforceEnvironmentIsolation`, `validateRuntimeEnvironment`), URL typo sanitizer (`normalizeSupabaseUrl`), JWT project ref inspection (`decodeJwtPayload`), blocking missing `ENVIRONMENT` (`503`) and blocking Production ref `iwuehabwpihnpahuhqki` or Production keys inside non-production runtimes.
- **`frontend/config/environments.js`** *(Added)*: Centralized 3-tier `ENVIRONMENT_MATRIX`, `resolveFrontendEnvironment`, `validateFrontendEnvironment`, and `assertStagingNotConnectedToProduction` preventing Staging-to-Production fallback and forbidding `service_role` keys in browser bundles.
- **`wrangler.toml`, `worker/wrangler.toml`** *(Modified)*: Consolidated canonical Worker entrypoint `main` to `src/index.js` (`../src/index.js` from `worker/`) and aligned Staging bindings (`ENVIRONMENT = "staging"`, `hpwtdlffidfircparanl`, `USE_V4_POSTGRES_RPC = "true"`).
- **`supabase/config.toml`** *(Modified & Committed)*: Synced `project_id = "wandermatch-v4-staging"` and `major_version = 17`.
- **`vercel.json`** *(Modified)*: Configured `outputDirectory: "frontend"`, `"public": true`, `git.deploymentEnabled.main = false`, `git.deploymentEnabled["feat/v4-architecture"] = true`, and `/api/*` rewrite to `wandermatch-api-staging`.

---

## 2. Backend Modularization & API Layer (`src/` & `worker.js`)

- **`src/index.js`** *(Added)*: Canonical Cloudflare Worker entrypoint wiring `enforceEnvironmentIsolation` -> `resolveCorsHeaders` -> `checkRateLimit` -> `withStorageLock` -> `dispatchV4Route` -> `legacyHandler.fetch`, with rollback snapshot safety and `X-Request-Id` / `X-Environment` headers.
- **`src/router/apiRouter.js`** *(Added)*: Preserves all 11 `V41_ROUTE_REGISTRY` routes and adds V4.2 endpoints in `V42_ROUTE_REGISTRY` (`GET /api/v4/auth/me`, `POST /api/v4/auth/login`, `POST /api/v4/auth/register`, `GET /api/v4/discovery/catalog`, `GET /api/v4/bookings/status`, `POST /api/v4/refunds/finalize`, `GET|POST /api/v4/reviews`, `GET /api/v4/notifications`, `POST /api/v4/notifications/read`, `POST /api/v4/pii/upsert`, `GET /api/v4/users/profile`, `POST /api/v4/cutover/replay-webhooks`, `POST /api/v4/cutover/rollback-rehearsal`).
- **`src/services/supabase/postgresRpcClient.js`** *(Added & Refined)*: `invokePostgresRpc` (role separation via `V4_USER_JWT_RPCS` / `V4_SERVICE_ROLE_RPCS`, GoTrue JWT validation, `P0001` prefix mapping to HTTP `402` / `409` / `410`), `selectPostgresRows`, `insertPostgresRows`.
- **`src/services/v4RelationalEngine.js`** *(Modified)*: Exported `deterministicUuidV4`, added dynamic future-date inventory generation (`ensureInventoryForDate`, `syncRemoteInventoriesForDate`, `rpcEnsureInventoryForDate`), profile sync (`_ensureUserProfileInTables`, `rpcEnsureUserProfile`), and local/PostgreSQL parity for `rpcSubmitReview`, `rpcGetMyNotifications`, and `rpcMarkNotificationRead`.
- **`src/modules/**`, `src/middleware/**`, `src/utils/**`, `src/security/piiCrypto.js`, `src/engines/recommendationEngine.js`, `src/services/external/externalServices.js`** *(Added)*: Separated domain controllers (`admin`, `ai`, `auth`, `blind-booking`, `booking`, `discovery`, `notifications`, `payment`, `reviews`, `users`), middleware, PII crypto, and logging.
- **`worker.js`** *(Modified)*: Runs `enforceEnvironmentIsolation` pre-hydrate, resolves deterministic UUIDv4 + `isAdmin` in `authenticateRequest`, syncs `ensure_user_profile_v4` on login/register, and exports shared primitives consumed by `src/index.js`.

---

## 3. Database Migrations (`supabase/migrations/` & `database/migrations/`)

- **`supabase/migrations/20261105000001..004_*.sql`** *(Tracked in Git)*: Synced the 27-table schema, RLS policies, atomic RPCs, and seed/reconciliation migrations with remote Staging history (`database/migrations/001..004` updated alongside).
- **`supabase/migrations/20261114000005_v4_2_security_and_profile_sync.sql`** *(Added & Applied to Staging)* & **`database/migrations/005_v4_2_security_and_profile_sync.sql`** *(Added)*:
  - Added `handle_new_auth_user_v4()` + `trg_on_auth_user_created_v4` on `auth.users` and backfilled missing `profiles` / `user_roles` / `user_preferences`.
  - Added `ensure_user_profile_v4`, `ensure_inventory_for_date_v4`, 3-arg `persist_recommendation_session_v4`, `submit_review_v4`, `get_my_notifications_v4`, and `mark_notification_read_v4`.
  - Hardened `is_admin` / `is_super_admin` (`REVOKE ALL FROM PUBLIC, anon`; anti-enumeration check) and tuned RLS policies with `(select auth.uid())`.

---

## 4. Frontend Integration (`frontend/` & Root Sync)

- **`frontend/core/bootstrapV4.js`** *(Added)*: `initFrontendAppV4`, `readActiveAccessToken`, and `syncSessionToken` genuinely initializing all 10 domain modules (`auth`, `profile`, `discovery`, `ai`, `blindBooking`, `booking`, `payment`, `reviews`, `notifications`, `admin`) onto `window.WM_V4`.
- **`frontend/core/appCore.js`, `frontend/services/apiClient.js`, `frontend/modules/**`** *(Added)*: Shared event bus, authenticated API client, and 10 modular service wrappers (`aiRecommendationModule.js`, `reviewsModule.js`, `notificationsModule.js`, etc.).
- **`frontend/index.html` & `frontend/app.js`** *(Modified, mirrored to root `index.html`, `app.js`, `supabaseClient.js`)*: Loaded `core/bootstrapV4.js`, synced `wm_session_prod` to `window.WM_V4.syncSessionToken`, attached `window.getAuthHeaders()` to `submitSlaRefundTicket`, and exposed `window.wmSubmitReviewV4` / `window.wmFetchNotificationsV4`.

---

## 5. CI/CD, Tooling & Verification Tests

- **`.github/workflows/deploy.yml`, `package.json`, `auto-sync-github.js`** *(Modified)*: Fixed ESM exports in `auto-sync-github.js`, bumped package scripts to `4.2.0`, added `verify:env`, deployed `src/index.js --env staging`, and gated `main` deployment steps.
- **`tests/v4-1-architecture-isolation.test.js` & `tests/v4-2-architecture-and-security.test.js`** *(Added)*; **`tests/security-hotfix.test.js` & `tests/worker-api.test.js`** *(Modified)*: Expanded verified automated suite to **36/36 passing tests**.
