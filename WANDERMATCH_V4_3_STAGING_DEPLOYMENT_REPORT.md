# WANDERMATCH V4.3 — STAGING DEPLOYMENT REPORT

**Date:** 2026-11-14  
**Scope:** Staging-Only Deployment Verification (`--env staging` enforced; Production 100% locked)

---

## 1. Deployed Staging Components

1. **GitHub (`Edtech-dev-design/wandermatch-v3`)**
   - Branch: `feat/v4-architecture`
   - V4.3 Code Commit: `df9349b8ee8cdd51ca0044ed1acaaf189a5e1ffc`
   - Production `main` verified untouched: `673b7bc682db0c91ff8f75c1af6a8ded774c6124`
   - GitHub Actions Run `43578383463` (`.github/workflows/deploy.yml`):
     - `1. Build, Environment Isolation Audit & V4.1 Test Matrix`: **`success`**
     - `2B. Deploy Cloudflare Worker Staging & Verify Supabase REST/RPC`: **`success`**
     - `2A` (`develop`) & `3` (`main`): **`skipped`** (Production gated)

2. **Cloudflare Worker Staging (`wandermatch-api-staging`)**
   - URL: `https://wandermatch-api-staging.vannong20182018.workers.dev`
   - Entrypoint: `src/index.js` (`353.46 KiB` / gzip `77.19 KiB`)
   - Code Deploy Version IDs recorded during V4.3 rollout:
     - `810afdd6-50ea-4954-a5b8-d447a2754d05` (`08:51:24Z`)
     - `9c32c010-f730-4c7b-abfa-34701751bd6f` (`08:54:56Z`)
     - `d6a36b9e-1738-4a64-8648-45f57013435b` (`08:58:33Z`)
   - Active Serving Deployment (after clean Staging `PAYMENT_WEBHOOK_SECRET` update): **`b2724c13-08a1-4ac4-8ae5-78510a7fdced`** (`2026-11-14T08:58:54.712Z`)
   - Configured Staging Secret Keys (verified via `npx wrangler secret list --env staging`; values never exposed): `PAYMENT_WEBHOOK_SECRET`, `SESSION_SECRET`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
   - Live `/api/v4/health` Verification:
     - `status: "HEALTHY"`, `environment: "staging"`, `supabase.projectRef: "hpwtdlffidfircparanl"`, `supabase.rpcMode: "POSTGRES_REST_RPC"`, `supabase.restConnected: true`, `supabase.status: "CONNECTED"`.

3. **Supabase Staging (`wandermatch-v4-staging` / `hpwtdlffidfircparanl`)**
   - REST + RPC + GoTrue Auth verified end-to-end across all 24 live scenarios (`24/24 PASS_LIVE_STAGING`).
   - Production Supabase (`iwuehabwpihnpahuhqki`) verified untouched (`npm run verify:env` exit 0).

4. **Vercel Staging Preview (`https://wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app`)**
   - `outputDirectory`: `frontend/` (`npm run build` exit 0).
   - Live browser audit stopped cleanly at Vercel Deployment Protection SSO gate (`https://vercel.com/login`, status: **`BLOCKED_BY_VERCEL_SSO`**).
