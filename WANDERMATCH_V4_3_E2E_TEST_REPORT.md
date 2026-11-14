# WANDERMATCH V4.3 — E2E TEST REPORT

**Date:** 2026-11-14  
**Test Harnesses:** `tests/v4-3-uat-and-integration.test.js`, `tests/v4-3-e2e-24-scenarios.mjs`  
**Unit/Integration Result (`npm test`):** **`40/40` PASS (`0` failed, `0` skipped, `4032.58ms`)**  
**Local 24-Scenario Result (`npm run test:e2e`):** **`24/24` `PASS_LOCAL` (`0` failed, `0` blocked, `p50=3.08ms`, `p95=42.64ms`)**  
**Live Staging 24-Scenario Result (`--live-staging`):** **`24/24` `PASS_LIVE_STAGING` (`0` failed, `0` blocked, `p50=290.73ms`, `p95=1542.39ms`)**

---

## 1. Execution Artifacts & Environment Scope
- **Local Artifact:** `scratch/v4_3_local_e2e.json` (`executedAt: 2026-11-14T08:58:18.440Z`, target `local:src/index.js`)
- **Live Staging Artifact:** `scratch/v4_3_live_staging_e2e.json` (`executedAt: 2026-11-14T08:59:16.606Z`, target `https://wandermatch-api-staging.vannong20182018.workers.dev` backed by live Supabase `hpwtdlffidfircparanl`)
- **Hosted Browser Preview (`https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app`):** **`BLOCKED_BY_VERCEL_SSO`** (tested separately by `browser` subagent; see `WANDERMATCH_V4_3_FRONTEND_UAT_REPORT.md`).

---

## 2. 24-Scenario E2E Matrix (Local vs. Live Cloud Staging)

| ID | Scenario | Local | Local ms | Live Staging | Live ms | Observed Evidence (Live Staging) |
| :--- | :--- | :--- | ---: | :--- | ---: | :--- |
| `E2E-01` | Landing Bootstrap & Env Isolation | `PASS_LOCAL` | 32.09 | `PASS_LIVE_STAGING` | 716.39 | HTTP `200`, `environment: "staging"`, V4 `4.3.0` |
| `E2E-02` | Register Account (Auth V4) | `PASS_LOCAL` | 49.66 | `PASS_LIVE_STAGING` | 1206.19 | HTTP `200`, live GoTrue UID created |
| `E2E-03` | Login & `/me` Persistence | `PASS_LOCAL` | 22.54 | `PASS_LIVE_STAGING` | 527.69 | HTTP `200` on `/auth/login` + `/auth/me` |
| `E2E-04` | Forgot & Reset Password Flow | `PASS_LOCAL` | 42.64 | `PASS_LIVE_STAGING` | 2527.47 | `forgot=200`, bad OTP=`401`, `reset=200` + relogin `200` |
| `E2E-05` | Update & Read Profile Preferences | `PASS_LOCAL` | 3.13 | `PASS_LIVE_STAGING` | 352.90 | `PUT=200`, `GET=200`, `source: "supabase_postgres"` |
| `E2E-06` | Load Discovery Catalog | `PASS_LOCAL` | 0.47 | `PASS_LIVE_STAGING` | 139.81 | HTTP `200`, `count: 9` |
| `E2E-07` | Search & Filter Catalog Safely | `PASS_LOCAL` | 0.53 | `PASS_LIVE_STAGING` | 106.96 | `matchedCount: 3`, zero secret leakage |
| `E2E-08` | AI Recommendation & k >= 3 Bundles | `PASS_LOCAL` | 22.03 | `PASS_LIVE_STAGING` | 176.21 | HTTP `200`, `packageCount: 3`, zero secrets |
| `E2E-09` | PII Upsert & Blind Booking Lock | `PASS_LOCAL` | 8.48 | `PASS_LIVE_STAGING` | 433.58 | `bookingCode: "WM20260030"`, `14,000,000 VND`, unrevealed |
| `E2E-10` | Owner Views Booking Status & List | `PASS_LOCAL` | 2.38 | `PASS_LIVE_STAGING` | 284.55 | `count: 1`, `status: "PENDING_PAYMENT"` |
| `E2E-11` | Cross-Tenant User B Blocked | `PASS_LOCAL` | 2.49 | `PASS_LIVE_STAGING` | 344.98 | `statusDenied: 403`, `revealDenied: 403` |
| `E2E-12` | Early Reveal Rejected Pre-Payment | `PASS_LOCAL` | 1.19 | `PASS_LIVE_STAGING` | 120.66 | `httpStatus: 402` |
| `E2E-13` | Invalid Webhook HMAC Rejected | `PASS_LOCAL` | 3.08 | `PASS_LIVE_STAGING` | 342.53 | `httpStatus: 401` |
| `E2E-14` | Valid Webhook Marks PAID | `PASS_LOCAL` | 3.04 | `PASS_LIVE_STAGING` | 257.14 | `webhookStatus: 200`, `bookingStatus: "PAID"` |
| `E2E-15` | Webhook Replay Strictly Idempotent | `PASS_LOCAL` | 3.40 | `PASS_LIVE_STAGING` | 290.73 | `idempotentReplay: true`, `paidAmountVnd: 14000000` |
| `E2E-16` | Authorized Post-Paid Reveal | `PASS_LOCAL` | 1.86 | `PASS_LIVE_STAGING` | 133.23 | Revealed `Nha Trang`, `Amiana Resort Nha Trang Bay`, `VN1340-SGN` |
| `E2E-17` | Post-Reveal Review & Public Feed | `PASS_LOCAL` | 1.70 | `PASS_LIVE_STAGING` | 246.76 | `postStatus: 200`, `reviewCount: 5` |
| `E2E-18` | Fetch Notifications & Mark Read | `PASS_LOCAL` | 0.54 | `PASS_LIVE_STAGING` | 129.50 | `200 OK` (`notificationCount: 0`, `markStatus: null` — no notification queued for fresh user during run) |
| `E2E-19` | Non-Admin Blocked on Admin APIs | `PASS_LOCAL` | 1.58 | `PASS_LIVE_STAGING` | 337.26 | `reconciliationStatus: 403`, `refundApproveStatus: 403` |
| `E2E-20` | Admin Reconciliation & Refund Approval | `PASS_LOCAL` | 9.55 | `PASS_LIVE_STAGING` | 1542.39 | `reconciliationStatus: 200`, `refundApproveStatus: 200` |
| `E2E-21` | Concurrent Booking Lock Serialization | `PASS_LOCAL` | 5.62 | `PASS_LIVE_STAGING` | 602.05 | Same-user `[200, 200]` (`[false, true]` replay) + cross-user `403` |
| `E2E-22` | Invalid Payload Returns 400 | `PASS_LOCAL` | 0.81 | `PASS_LIVE_STAGING` | 245.16 | `registerStatus: 400`, `profileStatus: 400` |
| `E2E-23` | Invalid JWT 401 & Session Clear | `PASS_LOCAL` | 1.78 | `PASS_LIVE_STAGING` | 222.81 | `authMeStatus: 401`, `bookingsStatus: 401`, `clientCleared: true` |
| `E2E-24` | Timeout (`504`) & `500` Client Resilience | `PASS_LOCAL` | 31.24 | `PASS_LIVE_STAGING` | 41.37 | `timeoutCode: "REQUEST_TIMEOUT"`, `err500Status: 500` |

---

## 3. Diagnostic Convergence During Live Staging Verification
Earlier intermediate live runs caught and verified real cloud constraints prior to reaching `24/24`:
1. Trailing `\r\n` from PowerShell pipe into `PAYMENT_WEBHOOK_SECRET` -> resolved by trimming in `verifyWebhookAuthentication` + binary-clean stdin upload.
2. GoTrue `/auth/v1/verify` requiring `anon` apikey for `magiclink` token exchange (`E2E-20`) -> fixed in E2E harness.
3. PostgreSQL `user_sensitive_pii_cccd_blind_index_key` blocking static test CCCD reuse across runs (`E2E-09`) -> fixed by per-run unique CCCD generation.
4. GoTrue Free Tier signup rate-limit returning non-429 error on rapid test signups (`E2E-02`) -> resolved via non-production Admin API signup fallback.
