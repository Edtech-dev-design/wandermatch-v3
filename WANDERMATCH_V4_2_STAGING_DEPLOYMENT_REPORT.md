# WANDERMATCH V4.2 — STAGING DEPLOYMENT REPORT

**Date:** 2026-11-14  
**Author:** Principal Architecture & Release Engineering Orchestrator  
**Deployment Scope:** STAGING ONLY (`feat/v4-architecture` / `wandermatch-api-staging` / `wandermatch-v4-staging`)  
**Production Impact:** **NONE** (Production untouched and verified read-only)

---

## 1. Git & Recovery Point Record

| Item | Value |
|---|---|
| **Repository** | `https://github.com/Edtech-dev-design/wandermatch-v3.git` |
| **Backup / Recovery Branch** | `backup/pre-v4-2-recovery` (`480b114aee183e4dad37a5028817791266f663cf`) |
| **Staging Development Branch** | `feat/v4-architecture` |
| **Latest Pushed Commit SHA** | `104f38db387aeafbc33ac40c943284ec54aa6b0c` |
| **Preceding V4.2 Commits** | `4eac22b293154813d0f2bd14c73d4b09abbf829f` (V4.2 refactor), `48cea1fc7c4fe5d792c31dd703906d5332e07ef1` (`P0001` status mapping fix) |
| **Production Branch (`main`)** | `673b7bc682db0c91ff8f75c1af6a8ded774c6124` (Untouched local & remote) |

---

## 2. Supabase Staging Deployment (`wandermatch-v4-staging`)

- **Project Ref**: `hpwtdlffidfircparanl` (confirmed in `supabase/.temp/project-ref` and `npx supabase migration list --linked`).
- **URL**: `https://hpwtdlffidfircparanl.supabase.co`
- **Applied Migrations (7/7 Remote = Local)**:
  1. `20261025000001` — `wandermatch_v3_schema.sql`
  2. `20261030000002` — `wm_worker_state.sql`
  3. `20261105000001` — `v4_schema_27_tables.sql`
  4. `20261105000002` — `v4_rls_and_privileges.sql`
  5. `20261105000003` — `v4_atomic_rpcs.sql`
  6. `20261105000004` — `v4_seed_and_reconciliation.sql`
  7. `20261114000005` — `v4_2_security_and_profile_sync.sql` (Applied cleanly during V4.2 deployment)

---

## 3. Cloudflare Workers Staging Deployment (`wandermatch-api-staging`)

- **Worker Name**: `wandermatch-api-staging`
- **Canonical Entrypoint**: `src/index.js` (configured in both `wrangler.toml` and `worker/wrangler.toml`)
- **Live URL**: `https://wandermatch-api-staging.vannong20182018.workers.dev`
- **Active Staging Version ID**: `e284cf25-163c-43dc-9528-77d44878c509` (deployed `2026-11-14T08:06:49.973Z`)
- **Intermediate V4.2 Version ID**: `ca66d26d-5dc4-430e-a9d8-7fb5d83c249e` (`2026-11-14T07:57:39.741Z`)
- **Pre-V4.2 Rollback Baseline Version ID**: `4cbfae3d-207c-4971-a4d3-e7f50f637bd0` (`2026-11-12T01:41:32.704Z`)
- **Configured Non-Secret Bindings**:
  - `ENVIRONMENT = "staging"`
  - `USE_V4_POSTGRES_RPC = "true"`
  - `SUPABASE_URL = "https://hpwtdlffidfircparanl.supabase.co"`
  - `SUPABASE_PROJECT_REF = "hpwtdlffidfircparanl"`
- **Provisioned Wrangler Secrets**: `PAYMENT_WEBHOOK_SECRET`, `SESSION_SECRET`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## 4. GitHub Actions CI/CD & Vercel Preview Status

### GitHub Actions Run `43574663629` (`feat/v4-architecture` @ `104f38d`)
- **Workflow URL**: `https://github.com/Edtech-dev-design/wandermatch-v3/actions/runs/43574663629`
- **Overall Status**: `completed` / **`success`**
  - Job `1. Build, Environment Isolation Audit & V4.1 Test Matrix`: **`success`** (`npm run build`, `npm run verify:env`, `npm test`)
  - Job `2B. Deploy Cloudflare Worker Staging & Verify Supabase REST/RPC`: **`success`** (deployed Staging Worker + verified live health & Supabase HTTPS connection; optional secret sync skipped)
  - Job `2A. Verify Development Branch (develop)`: `skipped` (branch guard)
  - Job `3. Deploy Static Frontend to GitHub Pages (Main Only — Production Worker Gated)`: `skipped` (Production deploy strictly disabled on `feat/v4-architecture`)

> *(Historical CI note: Preceding run `43574271451` on `48cea1f` failed `Validate Staging vs Production Environment Isolation` because `supabase/config.toml` still held `project_id = "wandermatch-v3"` in Git until synced in `104f38d`.)*

### Vercel Staging Preview (`wandermatch-v4`)
- **Preview URL**: `https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app`
- **Config File**: `vercel.json` (`"outputDirectory": "frontend"`, `"public": true`, `git.deploymentEnabled["main"] = false`, `git.deploymentEnabled["feat/v4-architecture"] = true`, `/api/*` rewrite to `wandermatch-api-staging`).
- **Live Verification Status**: **`BLOCKED` (Vercel Standard Deployment Protection SSO Gate)** — Unauthenticated HTTP GET returns HTTP `200` redirecting to `https://vercel.com/login?next=%2Fsso-api...` (`<title>Login – Vercel</title>`, `x-vercel-id: hkg1::vcdsw-1794643900476-1e9f423432eb`). No Vercel CLI login or bypass secret exists in this environment, and security rules forbid bypassing auth gates. Frontend modular build (`frontend/index.html`, `frontend/core/bootstrapV4.js`, `frontend/config/environments.js`, all 10 domain modules) is verified locally via `npm run build` and `V4.2-04`.

---

## 5. Production Untouched Verification (`VERIFIED_PRODUCTION_READ_ONLY`)

1. `git rev-parse main` -> `673b7bc682db0c91ff8f75c1af6a8ded774c6124`
2. `git ls-remote origin refs/heads/main` -> `673b7bc682db0c91ff8f75c1af6a8ded774c6124` (Zero pushes to `main`)
3. `Get-Content supabase\.temp\project-ref` -> `hpwtdlffidfircparanl` (Staging ref only; never linked to `iwuehabwpihnpahuhqki`)
4. `npx wrangler deployments list --name wandermatch-api` -> Returned `[code: 10007] This Worker does not exist on your account` (Production Worker absent/untouched on account `251175b21e549e1fd7785ef2f0a49c18`).
5. GitHub Actions Job `3. Deploy Static Frontend to GitHub Pages (Main Only — Production Worker Gated)` -> `skipped`.
