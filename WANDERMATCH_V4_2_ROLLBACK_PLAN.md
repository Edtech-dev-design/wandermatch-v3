# WANDERMATCH V4.2 — ROLLBACK PLAN (STAGING ONLY)

**Purpose:** Instant recovery procedures to revert Staging Cloudflare Worker, Staging Supabase migration `20261114000005`, or Git branch `feat/v4-architecture` without touching Production.

---

## 1. Cloudflare Staging Worker Instant Rollback (`wandermatch-api-staging`)

Cloudflare Workers keeps immutable prior deployments available for immediate traffic rollback.

### Available Version IDs (Verified via `npx wrangler deployments list --name wandermatch-api-staging`)
- **Current V4.2 Active Version**: `e284cf25-163c-43dc-9528-77d44878c509` (`2026-11-14T08:06:49.973Z`)
- **Intermediate V4.2 Version**: `ca66d26d-5dc4-430e-a9d8-7fb5d83c249e` (`2026-11-14T07:57:39.741Z`)
- **Pre-V4.2 Baseline Rollback Target**: `4cbfae3d-207c-4971-a4d3-e7f50f637bd0` (`2026-11-12T01:41:32.704Z`)

### Rollback Command (Staging Only)
```powershell
npx wrangler rollback --version-id 4cbfae3d-207c-4971-a4d3-e7f50f637bd0 --env staging --yes
```
Verify immediately after rollback:
```powershell
Invoke-RestMethod "https://wandermatch-api-staging.vannong20182018.workers.dev/api/v4/health"
```
> **Note on Secret Rollback:** `PAYMENT_WEBHOOK_SECRET` on `wandermatch-api-staging` was rotated/provisioned on `2026-11-14T07:57:29.858Z` (`6db72c41-e402-439d-ac2f-058a9ef02050`). If rolling back Worker code while preserving webhooks, re-sync `PAYMENT_WEBHOOK_SECRET` in SePay/webhook sender to match the Wrangler secret or update Wrangler secret via `npx wrangler secret put PAYMENT_WEBHOOK_SECRET --env staging`.

---

## 2. Git Repository Rollback (`feat/v4-architecture`)

A clean pre-recovery backup branch and tag/commit were captured before any V4.2 modifications:
- **Backup Branch:** `backup/pre-v4-2-recovery`
- **Backup Commit SHA:** `480b114aee183e4dad37a5028817791266f663cf`

### Non-Destructive Git Revert / Reset (Staging Branch Only — Never `main`)
```powershell
# Option A: Safe revert commit on feat/v4-architecture (preserves audit history)
git checkout feat/v4-architecture
git revert --no-commit 480b114aee183e4dad37a5028817791266f663cf..HEAD
git commit -m "revert: rollback V4.2 recovery to pre-v4-2 baseline (480b114)"
git push origin feat/v4-architecture

# Option B: Re-anchor local recovery branch if inspecting pre-V4.2 files
git checkout backup/pre-v4-2-recovery
```

---

## 3. Supabase Staging Database Rollback (`hpwtdlffidfircparanl`)

**CRITICAL RULE:** Never run `supabase db reset` or destructive `DROP TABLE` against remote Staging unless explicitly restoring data. Roll back V4.2 migration `20261114000005_v4_2_security_and_profile_sync.sql` cleanly using an additive forward-down migration if needed:

```sql
-- Rollback Script for V4.2 Migration 20261114000005 (Execute ONLY on Staging hpwtdlffidfircparanl)
DROP TRIGGER IF EXISTS trg_on_auth_user_created_v4 ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user_v4();
DROP FUNCTION IF EXISTS public.ensure_user_profile_v4(UUID, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS public.ensure_inventory_for_date_v4(DATE);
DROP FUNCTION IF EXISTS public.submit_review_v4(VARCHAR, SMALLINT, SMALLINT, TEXT);
DROP FUNCTION IF EXISTS public.get_my_notifications_v4(INT);
DROP FUNCTION IF EXISTS public.mark_notification_read_v4(UUID);
```
> **Note:** Leaving `20261114000005` backward-compatible triggers/functions active is safe even if Worker code is rolled back, because V4.2 only added non-breaking columns/RPCs and preserved `persist_recommendation_session_v4` backwards-compatibility. Always confirm `cat supabase/.temp/project-ref` equals `hpwtdlffidfircparanl` before running any remote Supabase CLI operation.
