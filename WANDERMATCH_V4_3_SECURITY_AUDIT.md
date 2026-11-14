# WANDERMATCH V4.3 — SECURITY AUDIT REPORT

**Date:** 2026-11-14  
**Scope:** Environment Isolation, Authentication, Authorization (RBAC / IDOR / RLS), Blind-Booking Secrecy, Payment Webhooks, PII Protection  
**Verification Basis:** `npm run verify:env`, `npm test` (`40/40`), Local & Live Staging E2E (`24/24` each)

---

## 1. Environment Isolation & Production Lock Controls
- **Staging Worker Guard (`src/middleware/envIsolationGuard.js`)**: Verified via `V4.1-01`, `V4.1-02`, and `V4.2-01` — rejects Staging startup/requests referencing Production Supabase ref `iwuehabwpihnpahuhqki` or Production service-role JWTs (`ENV_ISOLATION_VIOLATION` / `PRODUCTION_KEY_IN_STAGING_BLOCKED`).
- **Frontend Environment Guard (`frontend/config/environments.js`)**: Staging config strictly requires `hpwtdlffidfircparanl` in `supabaseUrl` & `supabaseProjectRef` (`V4.1-03`, `V4.3-03`).
- **Deploy Script Lock (`package.json`)**: `npm run deploy` fails hard with exit code `1` (`BLOCKED: Direct deploy is disabled by V4.3 Production Lock. Use npm run deploy:staging explicitly.`).
- **Git & Cloud Production Verification**:
  - `main` branch hash verified unchanged at `673b7bc682db0c91ff8f75c1af6a8ded774c6124`.
  - No secrets stored in source code, `scratch/*.json`, logs, or Markdown reports; temporary `STAGING_WEBHOOK_SECRET`, `STAGING_SUPABASE_SERVICE_ROLE_KEY`, and `STAGING_SUPABASE_ANON_KEY` existed strictly in PowerShell memory and were cleared via `finally`.

---

## 2. Authentication, Password Recovery & RBAC Controls
- **Zero-Backdoor Password Recovery (`src/modules/auth/authController.js`)**:
  - `POST /api/v4/auth/forgot-password` never echoes OTPs or recovery tokens in the HTTP response body (`RECOVERY_SENT` only; verified in `V4.3-02` and live `E2E-04`).
  - `POST /api/v4/auth/reset-password` rejects guessed/invalid OTPs (`401` verified locally & live `E2E-04`) and accepts only GoTrue-verified tokens/OTPs or validly signed `verifyToken` tokens.
  - Non-production GoTrue Admin fallback is gated strictly by `!isProductionEnv(env)`.
- **Invalid/Expired JWT Handling (`E2E-23`, `V4.3-03`)**:
  - Invalid JWTs return `401` on `/api/v4/auth/me` and `/api/v4/bookings`; client `apiClient` invokes `onUnauthorized` to clear stored session state.
- **Role-Based Access Control (`E2E-19`, `E2E-20`, `T-09`, `T-12`)**:
  - Client-supplied `role: "admin"` during registration is ignored (`security-hotfix.test.js`).
  - Non-admin users receive `403 Forbidden` on `/api/v4/reconciliation` and `/api/v4/refunds/approve` (verified locally & live Staging `E2E-19`).

---

## 3. Data Privacy, Blind Booking Secrecy & Payment Security
- **Multi-Tenant IDOR & Blind Reveal Enforcement (`E2E-11`, `E2E-12`, `T-01`, `T-02`)**:
  - User B attempting `GET /api/v4/bookings/status` or `POST /api/v4/bookings/reveal` on User A's booking is denied `403` (verified live `E2E-11`).
  - Owner calling `POST /api/v4/bookings/reveal` prior to payment is rejected with `402` (verified live `E2E-12`).
  - Pre-reveal responses (`POST /api/v4/recommendations`, `POST /api/v4/bookings`, `GET /api/v4/bookings`) exclude `secret_destination_id`, `secret_hotel_id`, `secret_flight_id`, `city_name`, `hotel_name`, and `flight_code` (`E2E-08`, `E2E-09`, `E2E-10`, plus `sealUnrevealedPackage` & `sealClientDraft` in frontend).
- **Encrypted PII Vault (`T-13`, live `E2E-09`)**:
  - `user_sensitive_pii` is isolated from direct client queries and enforces `UNIQUE(cccd_blind_index)` in PostgreSQL (directly observed returning `409` when reusing an existing CCCD across users on Staging).
- **Webhook Integrity & Idempotency (`E2E-13`, `E2E-14`, `E2E-15`, `T-04`)**:
  - Spoofed HMAC-SHA256 `x-sepay-signature` rejected `401`.
  - Valid HMAC marks `PAID`; replayed identical webhook returns `200` with `idempotent_replay: true` and `paid_amount_vnd` unchanged (`14,000,000 VND`).
