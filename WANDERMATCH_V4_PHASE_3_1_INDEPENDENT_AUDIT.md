# WANDERMATCH V4.0 – PHASE 3.1: INDEPENDENT IMPLEMENTATION AUDIT REPORT

**Date:** 2026-11-05  
**Audited Branch:** `feat/v4-architecture`  
**Audited Baseline Commit:** `2eba238` (*Phase 3 implementation baseline*)  
**Audit Remediated Commit:** `feat/v4-architecture` (Phase 3.1 Hardened)  
**Audit Role:** Principal Independent Security Auditor, Database Architect & Financial Systems Engineer  

> [!IMPORTANT]
> **Executive Truth Statement (No Over-Claiming):**  
> 1. **What the original 26/26 Phase 3 tests actually tested:** All `26/26` tests in Commit `2eba238` executed against **JavaScript in-memory engines** (`src/services/v4RelationalEngine.js` `V4RelationalDatabase` and `worker.js` `STORAGE`), **not** against a real PostgreSQL engine.  
> 2. **What happened when we executed the unmodified SQL migrations (`001`–`004`) on real PostgreSQL 16 (`@electric-sql/pglite` WASM):** Migration `001` failed immediately at line 18 with `SQLSTATE 42P01 (relation "public.user_roles" does not exist)` because `LANGUAGE sql` functions `public.is_admin()` and `public.is_super_admin()` were declared before `CREATE TABLE public.user_roles`. Migration `002` failed role queries with `SQLSTATE 42501 (permission denied for table bookings)` because RLS policies were created without table-level `GRANT SELECT` statements for `authenticated`, and lacked column-level `UPDATE` restrictions on `public.profiles` (`loyalty_tier` / `loyalty_points`).  
> 3. **Remediation & Real PostgreSQL 16 Verification in Phase 3.1:** During this Phase 3.1 audit, we remediated all discovered `P0`, `P1`, and `P2` defects across the SQL migrations (`001`–`004`), `src/services/v4RelationalEngine.js`, `worker.js`, `worker/index.js`, `worker/src/index.js`, `app.js`, `frontend/app.js`, and `.github/workflows/deploy.yml`, and verified all 4 SQL migrations, 27 RLS tables, 13 PL/pgSQL RPCs, and 8 financial reconciliation checks on **real PostgreSQL 16 (`@electric-sql/pglite`)** in addition to the `26/26` automated Node test suite and `14/14` Phase 1.5.1 regression suite.

---

## 1. Test Environment Verification & Classification

### 1.1 Environment Reality Analysis
In Phase 3 (`2eba238`), `node --test` ran 3 test files containing 26 test cases (`4` in `tests/security-hotfix.test.js`, `2` in `tests/worker.test.js`, and `20` in `tests/v4-acceptance-t01-t20.test.js`).
- **None of those 26 tests connected to a PostgreSQL process.**
- `T-01` through `T-20` invoked `new V4RelationalDatabase(...)` in `src/services/v4RelationalEngine.js:497-548`, which is an **in-memory JavaScript relational simulator** using `structuredClone` snapshots and a per-cluster Promise chain (`txMutex`).
- Only after we provisioned **real PostgreSQL 16 (`@electric-sql/pglite`)** in Phase 3.1 were the actual `.sql` files in `database/migrations/001`–`004` compiled and executed by the PostgreSQL C/WASM engine.

### 1.2 Complete Test Classification Matrix (`VERIFIED` vs `SIMULATED` vs `NOT VERIFIED`)

| Test ID / Suite | Test File & Line | Actual Engine in Phase 3 (`2eba238`) | True Test Category | Phase 3.1 Real PostgreSQL 16 Verification | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hotfix 1–4** | `tests/security-hotfix.test.js:1-260` | `worker.js` + in-memory `STORAGE` | Integration Test (Worker HTTP handler) | N/A (Worker HTTP layer) | **VERIFIED (Worker HTTP)** |
| **Worker 1–2** | `tests/worker.test.js:1-240` | `worker.js` + mocked Supabase REST | Integration Test (Worker HTTP + REST mock) | N/A (Worker HTTP layer) | **VERIFIED (Worker HTTP)** |
| **T-01 (RLS Isolation)** | `tests/v4-acceptance-t01-t20.test.js:45-98` | `V4RelationalDatabase` (JS in-memory) | Simulation (in Phase 3) -> Database Test (in Phase 3.1) | Executed on real PG 16 (`SET LOCAL ROLE anon/authenticated/service_role`) | **VERIFIED (Real PG 16 + JS)** |
| **T-02 (Blind Reveal Secrecy)** | `tests/v4-acceptance-t01-t20.test.js:100-157` | `V4RelationalDatabase` (JS in-memory) | Simulation (in Phase 3) -> Database Test (in Phase 3.1) | Executed `reveal_blind_booking_v4` & `booking_items` RLS on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-03 (Inventory Race 50x)** | `tests/v4-acceptance-t01-t20.test.js:159-202` | `V4RelationalDatabase` (JS single-isolate mutex) | Single-Process Concurrency Simulation | `create_booking_with_hold_v4` `FOR UPDATE` verified on PG 16; multi-connection pool stress pending cloud staging | **SIMULATED (50x JS) / VERIFIED (PG 16 SQL)** |
| **T-04 (Webhook 50x Replay)** | `tests/v4-acceptance-t01-t20.test.js:204-246` | `V4RelationalDatabase` (JS in-memory) | Single-Process Concurrency Simulation | `process_payment_webhook_v4` idempotency verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-05 (Split/Overpayment)** | `tests/v4-acceptance-t01-t20.test.js:248-309` | `V4RelationalDatabase` (JS in-memory) | Unit/State Machine Simulation | Generated columns & webhook accumulation verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-06 (`PAID_HOLD_CONFLICT`)** | `tests/v4-acceptance-t01-t20.test.js:311-368` | `V4RelationalDatabase` (JS in-memory) | State Machine Simulation | `expire_stale_holds_v4` & conflict path compiled/verified on PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-07 (Post-Reveal Refund)** | `tests/v4-acceptance-t01-t20.test.js:370-418` | `V4RelationalDatabase` (JS in-memory) | State Machine + DB Constraint Test | Fixed `refunds_tier_applied_check` violation in `003`; verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-08 (AI 5-Stage + $k \ge 3$)** | `tests/v4-acceptance-t01-t20.test.js:420-442` | `recommendationEngine.js` | Unit Test (Pure JS Engine) | `packages_k_anonymity_count_check` (`k >= 3`) verified on PG 16 | **VERIFIED (Unit + PG 16 Check)** |
| **T-09 (Admin Escalation Block)** | `tests/v4-acceptance-t01-t20.test.js:444-461` | `V4RelationalDatabase` (JS in-memory) | Security & Privilege Test | Column-level `UPDATE` block on `profiles` & `user_roles` RLS verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-10 (V3 -> V4 Recon #1–#7)** | `tests/v4-acceptance-t01-t20.test.js:463-510` | `V4RelationalDatabase` (JS in-memory) | Migration & Reconciliation Test | Double-run idempotency & `run_v4_reconciliation_checks()` = 0 verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-11 (Composite FK Binding)** | `tests/v4-acceptance-t01-t20.test.js:512-553` | `V4RelationalDatabase` (JS in-memory) | Database Constraint Test | Composite FKs `fk_packages_session_user` & `fk_bookings_package_user` verified on PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-12 (`search_path` Hijack)** | `tests/v4-acceptance-t01-t20.test.js:555-580` | `V4RelationalDatabase` (JS in-memory) | Database Security Test | `REVOKE CREATE ON SCHEMA public` & `SET search_path = pg_catalog, public` verified on PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-13 (PII AES-256-GCM)** | `tests/v4-acceptance-t01-t20.test.js:582-639` | `piiCrypto.js` (WebCrypto AES-GCM) | Unit Test (Cryptographic Module) | `user_sensitive_pii` format constraints (`^v[0-9]+:...`) & `get_my_masked_pii_v4` verified on PG 16 | **VERIFIED (WebCrypto + PG 16)** |
| **T-14 (Outbox Crash Recovery)** | `tests/v4-acceptance-t01-t20.test.js:641-695` | `V4RelationalDatabase` (JS in-memory) | Integration Simulation | `claim_due_outbox_events_v4` (`FOR UPDATE SKIP LOCKED` + lease recovery) verified on PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-15 (`RECONCILIATION_REQUIRED`)** | `tests/v4-acceptance-t01-t20.test.js:697-753` | `V4RelationalDatabase` (JS in-memory) | Financial State Machine Simulation | `claim_refund_for_processing_v4` & `finalize_refund_payout_v4` verified on PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-16 (Ambiguous Memo Reject)** | `tests/v4-acceptance-t01-t20.test.js:755-802` | `V4RelationalDatabase` (JS in-memory) | Input Validation & DB Trigger Test | `regexp_matches` multi-code ambiguity rejection verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-17 (State Transition Matrix)** | `tests/v4-acceptance-t01-t20.test.js:804-853` | `V4RelationalDatabase` (JS in-memory) | Database Trigger Test | `trg_enforce_booking_state_transition` verified on real PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-18 (Multi-Provider + Recon #8)**| `tests/v4-acceptance-t01-t20.test.js:855-914` | `V4RelationalDatabase` (JS in-memory) | Financial Ledger & Recon Test | `UNIQUE(payment_provider, external_transaction_id)` & `reconcile_external_settlement_v4` verified on PG 16 | **VERIFIED (Real PG 16 + JS)** |
| **T-19 (Sweeper vs Webhook)** | `tests/v4-acceptance-t01-t20.test.js:916-949` | `V4RelationalDatabase` (JS in-memory) | Single-Process Concurrency Simulation | Both RPCs verified on PG 16 | **SIMULATED (JS Race) / VERIFIED (PG 16 SQL)** |
| **T-20 ($k$-Anonymity Attack)** | `tests/v4-acceptance-t01-t20.test.js:951-980` | `recommendationEngine.js` | Adversarial Unit Test | Equivalence-class generalization (`k=2` -> `VIETNAM_CURATED_SANCTUARY`, `k=8`) verified | **VERIFIED (Unit)** |
| **Multi-Isolate Cloud Load** | N/A | Not executed on Cloudflare edge | Distributed Cloud Load Test | Requires live Cloudflare Workers + Supabase PostgreSQL staging | **NOT VERIFIED (Requires Cloud Staging)** |
| **Live SePay/Napas Sandbox** | N/A | Mocked HTTP callbacks | External Gateway Integration | Requires live SePay/Casso/Napas sandbox credentials | **NOT VERIFIED (Requires Live Sandbox)** |

---

## 2. Concurrency & Source-of-Truth Audit

### 2.1 Findings on `globalThis.__WM_DISTRIBUTED_STORAGE_LOCK__`
- **Location:** `worker.js:568-575`
- **Audit Verdict (`P0-CONC-01`):** Despite its variable name, `globalThis.__WM_DISTRIBUTED_STORAGE_LOCK__` is a **JavaScript `Promise` chain inside a single V8 isolate's memory space**.
  - It serializes asynchronous requests **only when they land on the exact same V8 isolate/Node.js process**.
  - In a multi-isolate Cloudflare Workers deployment, Isolate A and Isolate B do **not** share `globalThis`.
- **Audit Verdict on Legacy `hydrate(env)` / `persist(env)` (`P0-CONC-02`):**
  - In Phase 3 (`2eba238`), `worker.js:710-724` executed a blind `PATCH /rest/v1/wm_worker_state?singleton=eq.true` at the end of every `POST` request without checking `updated_at`.
  - Furthermore, `/api/v4/*` at `worker.js:1779-1796` only exposed `GET /api/v4/reconciliation`, passed `env` into `new V4RelationalDatabase(env)`, and did not forward transactional mutations to PostgreSQL RPCs.

### 2.2 Remediation Implemented in Phase 3.1
1. **PostgreSQL Atomic RPC Routing (`invokeV4RpcWithPostgresRouting`):**
   - Updated `worker.js:747-772` and `/api/v4/*` (`worker.js:1834-1991`) so that when `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `USE_V4_POSTGRES_RPC="true"` are configured, `/api/v4/bookings`, `/api/v4/webhooks/payment`, `/api/v4/bookings/reveal`, `/api/v4/refunds/request`, `/api/v4/refunds/approve`, `/api/v4/pii/masked`, `/api/v4/reconciliation`, and `/api/v4/reconciliation/settlement` execute **directly on PostgreSQL via PostgREST `/rest/v1/rpc/<rpc_name>`**.
2. **Optimistic Concurrency Control (CAS) on Legacy `wm_worker_state`:**
   - Updated `hydrate(env)` and `persist(env)` in `worker.js:690-745` to track `STORAGE._lastSyncedUpdatedAt` and issue conditional `PATCH /rest/v1/wm_worker_state?singleton=eq.true&updated_at=eq.<timestamp>` with `Prefer: return=representation`, automatically re-hydrating and monotonically merging on conflict.

---

## 3. PostgreSQL RLS, Privileges & `SECURITY DEFINER` RPC Audit

### 3.1 Findings & Fixes in SQL Migrations (`001`–`004`)
1. **`P0-SQL-01` (`001_v4_schema_27_tables.sql:87-115`):** Moved `public.is_admin()` and `public.is_super_admin()` (`LANGUAGE sql`) after `CREATE TABLE public.user_roles` so clean PostgreSQL 16 initialization succeeds without `42P01`.
2. **`P0-SQL-02` (`002_v4_rls_and_privileges.sql:14-55`):** Added explicit least-privilege `GRANT SELECT` to `authenticated` on the 26 RLS-protected tables (keeping zero grants on `user_sensitive_pii`), and restricted `public.profiles` updates by `authenticated` to `GRANT UPDATE (full_name, phone, avatar_url, updated_at) ON TABLE public.profiles TO authenticated;` (blocking `loyalty_tier` / `loyalty_points` self-escalation).
3. **`P1-SQL-03` (`003_v4_atomic_rpcs.sql:868-966`):** Normalized `v_effective_tier` inside `request_refund_v4` so `refunds.tier_applied` always satisfies `refunds_tier_applied_check`.

---

## 4. Blind Booking Secrecy Audit (Backend, Frontend, Shadow Files & CI/CD)

1. **`P0-BLIND-02` (`worker/index.js` & `worker/src/index.js`):** Replaced both legacy shadow worker files (which contained the hardcoded Base64 Gemini key, unsealed `/api/ai-recommend`, and unauthenticated `/api/admin-summary`) with clean re-exports of root `worker.js`.
2. **`P1-BLIND-01` (`app.js:447-502` & `frontend/app.js:447-502`):** Replaced object spreads (`...copy.hotel`, `...copy.flight`) in `window.sealUnrevealedPackage` with a strict pre-reveal allowlist that masks `room_type`, `room_specs`, `amenities`, `flight.airline`, and `flight.time` before Reveal.
3. **`P1-SEC-01` (`.github/workflows/deploy.yml:29-44`):** Restricted GitHub Pages artifact upload to a staged `_site` directory containing only static frontend files (`index.html`, `facebook-auth.html`, `styles.css`, `app.js`, `supabaseClient.js`).

---

## 5. Financial, Outbox, Settlement & V3->V4 Migration Audit

1. **`P1-FIN-01` (`003_v4_atomic_rpcs.sql:1225-1275` & `v4RelationalEngine.js:2184-2233`):** Added `public.claim_due_outbox_events_v4` (`FOR UPDATE SKIP LOCKED`) and updated `processOutboxBatch` to reclaim stale `PROCESSING` events after lease expiry (`locked_until <= NOW()`).
2. **`P1-FIN-02` (`004_v4_seed_and_reconciliation.sql:193-279` & `v4RelationalEngine.js:2750-2821`):** Added `public.reconcile_external_settlement_v4` (`Recon #8`) to detect `MISSING_IN_DB`, `MISSING_AT_PROVIDER`, and `AMOUNT_MISMATCH` between external bank statements and `payment_transactions`.
3. **`P1-MIG-01` (`v4RelationalEngine.js:2346-2556`):** Made `migrateV3StateToV4` 100% idempotent on repeated runs, mapped legacy V3 statuses (`CONFIRMED` -> `PAID`, `LOCKED` -> `PENDING_PAYMENT`), and synthesized opening balance `INFLOW` transactions (`MIG-OPENING-{bookingCode}`) when needed.
