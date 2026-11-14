# WANDERMATCH V4.3 — CHANGELOG

**Release Tag / Version:** `4.3.0` (`package.json`)  
**Branch:** `feat/v4-architecture`  
**Base V4.2 Commit:** `35ef4ce50737d36bcdf74ee29b9280c2a8e69c45` -> **V4.3 Code Commit:** `df9349b8ee8cdd51ca0044ed1acaaf189a5e1ffc`

---

## Added
- **Backend Endpoints (`src/router/apiRouter.js`, domain controllers):**
  - `POST /api/v4/auth/forgot-password` & `POST /api/v4/auth/reset-password` (`src/modules/auth/authController.js`) with zero-backdoor validation and `verifyToken` + GoTrue support.
  - `PUT /api/v4/users/profile` & `POST /api/v4/users/profile` (`src/modules/users/usersController.js`) updating `public.profiles` and `public.user_preferences`.
  - `GET /api/v4/bookings` (`src/modules/booking/bookingController.js`) returning safe pre-reveal booking projections via `buildSafeBookingProjection`.
- **Frontend UI & V4 Module Integrations (`frontend/` & root `index.html`, `app.js`):**
  - Integrated `#unifiedAuthModal` 4-mode flow + URL `#type=recovery` handling.
  - Added navbar notifications button/badge (`#navNotificationsBtn`, `#navNotificationsBadge`), admin modal button (`#navAdminBtn`), `#v4ReviewsSection`, `#v4NotificationsModal`, `#v4AdminDashboardModal`, `#b2bSearchInput`, `#b2bBudgetFilter`, and `#profEditName` / `#profEditPhone` controls.
  - Added B2B pre-reveal sealing helpers (`containsForbiddenSecretFields`, `sealClientDraft`, `sealUnrevealedPackage`), catalog search/budget filters (`filterCatalogItems`), and normalized payment polling (`paymentModule.checkPaymentStatus`).
- **Verification Suites (`tests/`):**
  - Added `tests/v4-3-uat-and-integration.test.js` (`V4.3-01`..`V4.3-03`).
  - Added `tests/v4-3-e2e-24-scenarios.mjs` (`E2E-01`..`E2E-24` supporting both local full-stack and `--live-staging` cloud execution).
  - Added `"test:e2e"` npm script and explicit Staging-only `npm run deploy` guard (`package.json` `4.3.0`).

## Changed & Fixed
- Exported `hashPassword` and `verifyToken` from `worker.js` and wired them through `src/index.js` -> `src/router/apiRouter.js` -> `handleResetPasswordV4` to eliminate duplicate JWT verification.
- Trimmed `PAYMENT_WEBHOOK_SECRET || WEBHOOK_SECRET` in `worker.js` (`verifyWebhookAuthentication`) to prevent newline corruption.
- Normalized lowercase role names (`"admin"`, `"super_admin"`, `"b2b_partner"`, `"traveler"`) in `src/services/v4RelationalEngine.js` (`_ensureUserProfileInTables`, `rpcEnsureUserProfile`) matching PostgreSQL constraints, and ensured admin role provisioning in `src/modules/admin/adminController.js` (`handleApproveRefundV4`).
- Hardened non-production `handleRegisterV4` GoTrue Free Tier rate-limit fallback and changed `handleLoginV4` fallback failure status to `401 INVALID_CREDENTIALS` unless legacy V3 password migration succeeds.
- Upgraded `frontend/services/apiClient.js` (`timeoutMs` `AbortController` `504 REQUEST_TIMEOUT`, `put`, `delete`, `onUnauthorized`, `wm:v4:network` events) and `frontend/core/bootstrapV4.js` (`4.3.0`).

## Security & Verification
- Verified `npm test` `40/40`, `npm run test:e2e` `24/24 PASS_LOCAL`, `--live-staging` `24/24 PASS_LIVE_STAGING`, and GitHub Actions Run `43578383463` `success`.
- Confirmed Production lock (`main` at `673b7bc682db0c91ff8f75c1af6a8ded774c6124`, `iwuehabwpihnpahuhqki`, `wandermatch-api`) intact.
