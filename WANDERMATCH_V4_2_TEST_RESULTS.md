# WANDERMATCH V4.2 — TEST & VERIFICATION RESULTS

**Date:** 2026-11-14  
**Classification Standard:** Every check is labeled strictly by actual execution evidence (`VERIFIED_LOCAL`, `VERIFIED_STAGING`, `VERIFIED_PRODUCTION_READ_ONLY`, `FAILED`, `BLOCKED`, `NOT_TESTED`). No local/mocked check is labeled as live Staging.

---

## 1. Summary Matrix

| Scope | Classification | Passed | Failed | Blocked | Notes |
|---|---|---|---|---|---|
| Syntax Build & Env Guard (`npm run build`, `npm run verify:env`) | `VERIFIED_LOCAL` | 2 / 2 | 0 | 0 | All JS modules syntax-checked; zero `iwuehabwpihnpahuhqki` in Staging configs |
| Automated Node Test Suite (`npm test`) | `VERIFIED_LOCAL` | 36 / 36 | 0 | 0 | 0 skipped, 0 cancelled (`4050.07ms` latest run after final code/config sync) |
| GitHub Actions CI (`deploy.yml` Run `43574663629` @ `104f38d`) | `VERIFIED_STAGING` | 2 jobs | 0 | 0 | `verify-staging` + `deploy-worker-staging` succeeded; `develop` & `main` gated/skipped |
| Live Staging E2E (`LIVE-01`..`LIVE-13` via Worker + Supabase `hpwtdlffidfircparanl`) | `VERIFIED_STAGING` | 13 / 13 | 0 | 0 | Executed against live Cloudflare Worker & live PostgreSQL Staging DB |
| Live Vercel Preview Unauthenticated Probe (`LIVE-VERCEL-PREVIEW`) | `BLOCKED` | 0 | 0 | 1 | Redirected to Vercel SSO (`https://vercel.com/login?...`); Team Deployment Protection active |
| Production Environment Unchanged Checks | `VERIFIED_PRODUCTION_READ_ONLY` | 4 / 4 | 0 | 0 | Read-only checks confirm `main`, Production Worker, and Production Supabase untouched |

---

## 2. `VERIFIED_LOCAL` — Build, Env Check & Automated Node Test Suite (`36 / 36 PASS`)

Executed after final commit `104f38d`:

### Build & Config Checks
- `npm run build`: Exited `0` (verified `node --check` on `app.js`, `frontend/app.js`, `frontend/supabaseClient.js`, `frontend/config/environments.js`, `frontend/core/appCore.js`, `frontend/core/bootstrapV4.js`, `frontend/services/apiClient.js`, `frontend/modules/ai/aiRecommendationModule.js`, `frontend/modules/reviews/reviewsModule.js`, `frontend/modules/notifications/notificationsModule.js`, `worker.js`, `src/index.js`, `src/router/apiRouter.js`, `src/modules/auth/authController.js`, `src/modules/reviews/reviewsController.js`, `src/modules/notifications/notificationsController.js`, `auto-sync-github.js`).
- `npm run verify:env`: Exited `0` (`Environment configuration verified: Staging targets strictly isolated from Production.`).

### `npm test` Breakdown (`36 / 36 PASS`)
1. `tests/security-hotfix.test.js` + `tests/worker-api.test.js` (5 tests):
   - Admin API protection (`401`/`403`/`200`), wrong-password `401`, blind recommendation secrecy & duplicate booking prevention, payment reconciliation & webhook idempotency, persistent-store contracts — **5 / 5 PASS**.
2. `tests/v4-1-architecture-isolation.test.js` (4 tests):
   - `V4.1-01` (block `iwuehabwpihnpahuhqki` in Staging), `V4.1-02` (block Production JWT key in Staging), `V4.1-03` (frontend env isolation), `V4.1-04` (resilient AI fallback) — **4 / 4 PASS**.
3. `tests/v4-2-architecture-and-security.test.js` (5 tests):
   - `V4.2-01`: Route registries preserve 11 `V41_ROUTE_REGISTRY` keys & expose expanded `V42_ROUTE_REGISTRY` routes — **PASS**.
   - `V4.2-02`: Environment Isolation Guard fails closed (`503`) on missing `ENVIRONMENT` or Production ref/key in Staging — **PASS**.
   - `V4.2-03`: Authenticated E2E lifecycle via `src/index.js` (dynamic future date, HMAC webhook, reveal, review, cross-tenant `403`, masked PII) — **PASS**.
   - `V4.2-04`: `initFrontendAppV4` wires all 10 frontend modules & `validateFrontendEnvironment` / `assertStagingNotConnectedToProduction` block Production ref — **PASS**.
   - `V4.2-05`: `invokePostgresRpc` maps PostgREST `400` (`P0001`) domain prefixes (`PAYMENT_REQUIRED:`, `PAYMENT_RECONCILIATION_FAILED:`, `HOLD_CONFLICT:`, `INSUFFICIENT_INVENTORY:`, `GONE:`) to `402`/`409`/`410` — **PASS**.
4. `tests/v4-acceptance-t01-t20.test.js` (`T-01`..`T-20`, 20 tests + suite wrapper):
   - RLS cross-tenant isolation, blind reveal secrecy, 50-request concurrency hold race, 50-request webhook replay storm, split/overpayment accumulation, `PAID_HOLD_CONFLICT`, post-reveal refund rules, k-anonymity (`k >= 3`), role escalation prevention, reconciliation Recon #1-#7, PII encryption & blind index, outbox idempotency, gateway timeout lock, state-machine triggers, adversarial equivalence test — **ALL PASS**.

---

## 3. `VERIFIED_STAGING` — Live Cloud E2E Matrix (`LIVE-01` .. `LIVE-13`)

Executed against live `https://wandermatch-api-staging.vannong20182018.workers.dev` (Version ID `e284cf25-163c-43dc-9528-77d44878c509`) + live Supabase `hpwtdlffidfircparanl`:

| ID | Verification | Observed Live Output / Evidence | Status |
|---|---|---|---|
| `LIVE-01` | Worker & Supabase health probes (`/api/v4/health`, `/api/health?check=supabase`) | `environment: "staging"`, `projectRef: "hpwtdlffidfircparanl"`, `rpcMode: "POSTGRES_REST_RPC"`, `requestId: "wm_mwg4mtro_c2zsqxx9"` | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-02` | GoTrue user auth + profile auto-sync (`/api/v4/auth/me`, `/api/v4/users/profile`) | `userA_id: "55e84d3c-e90c-4ffb-9ed5-d03c5571f53d"`, `userB_id: "4448a790-70d3-4b49-9dee-64a6770636fe"`, `profileSource: "supabase_postgres"` *(Note below on GoTrue 429 email quota)* | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-03` | Dynamic future date recommendations (`2026-12-20`) & pre-reveal secrecy | `POST /api/v4/recommendations` -> `session_id: "b6e69d8a-422c-45c5-b197-bf8224e4c983"`, `packageCount: 3`, zero `secret_*` fields | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-04` | Direct PostgREST table & anon RPC security checks | `user_sensitive_pii` (`anon: 401`, `auth: 403`), `outbox_events` (`anon: 401`, `auth: 200`, `0` rows), `packages` (`anon: 401`, `auth: 200`, `0` rows), `rpc/is_admin` (`401`), `rpc/is_super_admin` (`401`) | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-05` | Atomic booking hold creation & status read | Booking `WM20260017` created (`PENDING_PAYMENT`, `expected_amount_vnd: 12000000`, `is_revealed: false`) | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-06` | Early reveal blocked prior to payment (`POST /api/v4/bookings/reveal`) | Returned HTTP **`402`** (`PAYMENT_REQUIRED`) | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-07` | Forged payment webhook rejection (`x-sepay-signature: 0000...`) | Returned HTTP **`401`** | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-08` | Valid HMAC-SHA256 webhook payment + idempotent replay | First delivery `status: "PAID"`; replay returned `200`, `idempotent_replay: true`, unchanged `paid_amount_vnd` | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-09` | Cross-tenant isolation (User B probing User A's booking `WM20260017`) | `GET /api/v4/bookings/status`: **`403`**; `POST /api/v4/bookings/reveal`: **`403`** | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-10` | Authorized blind booking reveal post-payment | Returned `200`, revealed destination city: `"Nha Trang"` | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-11` | Post-reveal review, notifications & catalog | Review `cb5b74dc-64ba-4a83-ab00-605cdc51aad9` saved (`APPROVED`); `/api/v4/notifications` (`200`, `0` items); `/api/v4/discovery/catalog` (`9` destinations) | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-12` | Live concurrent booking race (`2026-12-22`, 3 parallel requests) | Winner `WM20260018`, `uniqueCodesCreated: 1`, User B cross-user contention returned **`403`** | `PASS` (`VERIFIED_STAGING`) |
| `LIVE-13` | Refund lifecycle, non-admin `403`, admin approve/settle & reconciliation | Non-admin `/api/v4/reconciliation` & `/api/v4/refunds/approve`: **`403`**; Admin refund `32a9a670-9889-42c6-9490-c5657d15f167` -> `payout_status: "SUCCEEDED"`; reconciliation `total_discrepancies: 0` | `PASS` (`VERIFIED_STAGING`) |

> **Transparent Note on `LIVE-02` (`/api/v4/auth/register`):** During the live test run, `POST /api/v4/auth/register` forwarded signup to Supabase GoTrue, which returned HTTP `429 (email rate limit exceeded)` under Staging's default email quota for throwaway `@example.com` addresses. The live harness cleanly generated an admin link + verified GoTrue OTP (`/auth/v1/verify`) to obtain genuine Staging GoTrue JWTs and validate `trg_on_auth_user_created_v4` + `handle_new_auth_user_v4` profile auto-creation in PostgreSQL.

---

## 4. `BLOCKED` & `VERIFIED_PRODUCTION_READ_ONLY` Checks

### `LIVE-VERCEL-PREVIEW` (`BLOCKED`)
- **Target**: `https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app`
- **Observed Response**: HTTP `200` redirecting to `https://vercel.com/login?next=%2Fsso-api...` (`<title>Login – Vercel</title>`, `x-vercel-id: hkg1::vcdsw-1794643900476-1e9f423432eb`).
- **Reason**: Vercel Standard Deployment Protection (SSO) is active on the Preview URL. Public/unauthenticated automated DOM or asset checks cannot cross Vercel SSO without team authentication, and security policy prohibits bypassing auth gates. Opening the URL in an authenticated Vercel team browser session will allow visual UAT.

### Production Read-Only Verification (`VERIFIED_PRODUCTION_READ_ONLY`)
- `git rev-parse main`: `673b7bc682db0c91ff8f75c1af6a8ded774c6124` (identical to `git ls-remote origin refs/heads/main`).
- `supabase/.temp/project-ref`: `hpwtdlffidfircparanl` (never `iwuehabwpihnpahuhqki`).
- `npx wrangler deployments list --name wandermatch-api`: `[code: 10007] This Worker does not exist on your account` (Production Worker untouched).
- GitHub Actions Job `3. Deploy Static Frontend to GitHub Pages (Main Only — Production Worker Gated)`: `skipped`.
