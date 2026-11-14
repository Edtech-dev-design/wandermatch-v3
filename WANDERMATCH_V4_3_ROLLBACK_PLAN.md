# WANDERMATCH V4.3 — ROLLBACK PLAN

**Date:** 2026-11-14  
**Scope:** Staging-Only Rollback Procedures (Production remains untouched at `673b7bc682db0c91ff8f75c1af6a8ded774c6124`)

---

## 1. Known Safe Recovery Points

| Target | Safe Baseline Reference | Identifier |
| :--- | :--- | :--- |
| **Git `feat/v4-architecture` (Pre-V4.3 / V4.2)** | V4.2 Commit | `35ef4ce50737d36bcdf74ee29b9280c2a8e69c45` |
| **Git Pre-V4.2 Backup Branch** | `backup/pre-v4-2-recovery` | `480b114aee183e4dad37a5028817791266f663cf` |
| **Cloudflare Worker Staging (Pre-V4.3 Baseline)** | Reported V4.2 Deployment Version | `e284cf25-163c-43dc-9528-77d44878c509` |
| **Cloudflare Worker Staging (Previous V4.3 Code Version)** | Code Deploy Version ID | `9c32c010-f730-4c7b-abfa-34701751bd6f` |

---

## 2. Immediate Cloudflare Worker Staging Rollback
If regressions appear on `wandermatch-api-staging`:
1. List recent Staging versions:
   ```powershell
   npx wrangler deployments list --env staging
   ```
2. Roll back ONLY Staging Worker (`--env staging`) to `e284cf25-163c-43dc-9528-77d44878c509` (or check out `35ef4ce50737d36bcdf74ee29b9280c2a8e69c45` and deploy explicitly to `--env staging`):
   ```powershell
   npx wrangler rollback e284cf25-163c-43dc-9528-77d44878c509 --env staging
   ```
   > Never omit `--env staging`.
3. Re-verify `https://wandermatch-api-staging.vannong20182018.workers.dev/api/v4/health` returns `200 HEALTHY` with `projectRef: "hpwtdlffidfircparanl"`.

---

## 3. Git Branch & Vercel Preview Rollback (`feat/v4-architecture` Only)
1. Revert cleanly without touching `main`:
   ```powershell
   git checkout feat/v4-architecture
   git revert df9349b8ee8cdd51ca0044ed1acaaf189a5e1ffc
   git push origin feat/v4-architecture
   ```
2. Or restore full V4.2 repository state on a new branch from `35ef4ce50737d36bcdf74ee29b9280c2a8e69c45` or `backup/pre-v4-2-recovery` (`480b114aee183e4dad37a5028817791266f663cf`).
3. Confirm Vercel Preview automatically rebuilds `frontend/` from the reverted commit.

---

## 4. Database Rollback Note
- **V4.3 applied zero DDL migrations** to Supabase Staging `hpwtdlffidfircparanl` (or Production `iwuehabwpihnpahuhqki`). All V4.3 persistence operates on existing V4.2 schema tables (`profiles`, `user_preferences`, `bookings`, etc.) and RPCs (`ensure_user_profile_v4`, `create_booking_with_hold_v4`, `approve_refund_v4`), so schema rollback is unnecessary.
