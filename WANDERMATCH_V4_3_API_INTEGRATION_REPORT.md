# WANDERMATCH V4.3 — API INTEGRATION REPORT

**Date:** 2026-11-14  
**Worker Name:** `wandermatch-api-staging`  
**Worker URL:** `https://wandermatch-api-staging.vannong20182018.workers.dev`  
**Active Deployment Version ID:** `b2724c13-08a1-4ac4-8ae5-78510a7fdced` (code deploy `d6a36b9e-1738-4a64-8648-45f57013435b`)  
**Supabase Staging Ref:** `hpwtdlffidfircparanl` (`USE_V4_POSTGRES_RPC = "true"`)

---

## 1. `/api/v4/*` Route Contract Verification

All routes dispatch from `src/index.js` -> `src/router/apiRouter.js` (`V42_ROUTE_REGISTRY`, preserving all 11 keys in `V41_ROUTE_REGISTRY`).

| Method & Endpoint | Controller | Auth / Gate | Live Staging Check |
| :--- | :--- | :--- | :--- |
| `GET /api/v4/health` | `worker.js` canonical probe | Public + Env Guard | `200 HEALTHY`, `restConnected: true`, `projectRef: hpwtdlffidfircparanl` (`E2E-01`) |
| `POST /api/v4/auth/register` | `authController.js` | Public + Non-prod GoTrue fallback | `200` on valid signup (`E2E-02`), `400` on invalid input (`E2E-22`) |
| `POST /api/v4/auth/login` | `authController.js` | Public (GoTrue + legacy fallback -> `401`) | `200` with GoTrue JWT (`E2E-03`) |
| `GET /api/v4/auth/me` | `authController.js` | Bearer JWT | `200` (`E2E-03`), `401` invalid JWT (`E2E-23`) |
| `POST /api/v4/auth/forgot-password` | `authController.js` | Public (zero OTP leakage) | `200 RECOVERY_SENT` (`E2E-04`) |
| `POST /api/v4/auth/reset-password` | `authController.js` | Signed recovery token / OTP (`verifyToken` + GoTrue) | `401` invalid OTP, `200 PASSWORD_UPDATED` + relogin `200` (`E2E-04`) |
| `GET /api/v4/users/profile` | `usersController.js` | Bearer JWT | `200`, `source: "supabase_postgres"` (`E2E-05`) |
| `PUT /api/v4/users/profile` | `usersController.js` | Bearer JWT | `200` updating `profiles` + `user_preferences` (`E2E-05`), `400` short name (`E2E-22`) |
| `POST /api/v4/users/profile` | `usersController.js` | Bearer JWT | Registered in `V42_ROUTE_REGISTRY` & verified (`V4.3-01`) |
| `GET /api/v4/discovery/catalog` | `discoveryController.js` | Public | `200`, 9 destinations (`E2E-06`) |
| `POST /api/v4/recommendations` | `blindBookingController.js` | Bearer JWT | `200`, `k >= 3` sealed bundles (`E2E-08`) |
| `GET /api/v4/packages/sealed` | `blindBookingController.js` | Bearer JWT (owner/admin) | Verified in `V4.2` & RLS checks |
| `GET /api/v4/bookings` | `bookingController.js` | Bearer JWT (strict `user_id` filter + `buildSafeBookingProjection`) | `200` safe list without destination/hotel/flight secrets (`E2E-10`) |
| `POST /api/v4/bookings` | `bookingController.js` | Bearer JWT (`create_booking_with_hold_v4`) | `200 PENDING_PAYMENT` (`E2E-09`), concurrent serialization + `403` cross-user block (`E2E-21`) |
| `GET /api/v4/bookings/status` | `bookingController.js` | Bearer JWT (owner only) | `200` owner (`E2E-10`), `403` User B (`E2E-11`) |
| `POST /api/v4/bookings/reveal` | `bookingController.js` | Bearer JWT (owner + PAID) | `402` pre-payment (`E2E-12`), `403` User B (`E2E-11`), `200` after payment (`E2E-16`) |
| `POST /api/v4/webhooks/payment` | `paymentController.js` | HMAC-SHA256 `x-sepay-signature` / secret | `401` invalid sig (`E2E-13`), `200 PAID` (`E2E-14`), `200 idempotent_replay: true` (`E2E-15`) |
| `POST /api/v4/pii/upsert` | `piiController.js` | Bearer JWT (`service_role` encryption) | `200` (`E2E-09`), unique `cccd_blind_index` `409` verified against Postgres |
| `GET /api/v4/pii/masked` | `piiController.js` | Bearer JWT | Covered by `T-13` & `V4.2` tests |
| `POST /api/v4/reviews` / `GET /api/v4/reviews` | `reviewsController.js` | Bearer JWT (POST) / Public (GET) | `200` post-reveal review & public feed (`E2E-17`) |
| `GET /api/v4/notifications` / `POST .../read` | `notificationsController.js` | Bearer JWT | `200` list (`E2E-18`) |
| `POST /api/v4/refunds/request` | `refundController.js` | Bearer JWT (owner) | `200` verified inside `E2E-20` |
| `POST /api/v4/refunds/approve` | `adminController.js` | Admin JWT (`requireAdminRole`) | `403` non-admin (`E2E-19`), `200` admin approval + auto-settle (`E2E-20`) |
| `GET /api/v4/reconciliation` | `adminController.js` | Admin JWT (`requireAdminRole`) | `403` non-admin (`E2E-19`), `200` admin checks (`E2E-20`) |

---

## 2. Live Staging Bugs Discovered & Fixed During Integration
1. **Password Reset Token Compatibility (`authController.js`, `src/index.js`, `apiRouter.js`, `worker.js`)**: Forwarded `verifyToken` from `worker.js` to `handleResetPasswordV4` so both GoTrue JWTs and 2-part Worker HMAC tokens verify cleanly without duplicating crypto code.
2. **Role Casing Mismatch (`v4RelationalEngine.js`, `adminController.js`)**: Normalized `rpcEnsureUserProfile` role mapping to lowercase (`"admin"`, `"super_admin"`, `"b2b_partner"`, `"traveler"`) to match PostgreSQL `CHECK` constraint and `isAdmin(uid)`, and synced admin `user_roles` in `handleApproveRefundV4`.
3. **GoTrue Free Tier Signup Resilience (`authController.js`)**: Generalized non-production signup fallback to GoTrue Admin API (`email_confirm: true`) whenever non-duplicate Free Tier rate limits or SMTP bounces occur, and changed failed GoTrue login fallback to return `401 INVALID_CREDENTIALS` unless a legacy V3 user migration succeeds.
4. **Webhook Signature Header Hygiene (`worker.js`)**: Trimmed `PAYMENT_WEBHOOK_SECRET || WEBHOOK_SECRET` in `verifyWebhookAuthentication` to eliminate trailing newline mismatches across CLI uploads.
