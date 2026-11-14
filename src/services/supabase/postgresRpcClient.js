// ============================================================================
// WANDERMATCH V4.1 — SUPABASE HTTPS REST -> POSTGRESQL RPC CLIENT
// Enforces environment isolation and User-JWT vs Service-Role RPC boundaries
// ============================================================================

import {
  enforceEnvironmentIsolation,
  normalizeSupabaseUrl
} from "../../middleware/envIsolationGuard.js";

export const V4_USER_JWT_RPCS = new Set([
  "create_booking_with_hold_v4",
  "reveal_blind_booking_v4",
  "request_refund_v4",
  "approve_refund_v4",
  "get_my_masked_pii_v4",
  "get_my_sealed_packages_v4"
]);

export const V4_SERVICE_ROLE_RPCS = new Set([
  "persist_recommendation_session_v4",
  "process_payment_webhook_v4",
  "ingest_webhook_event_v4",
  "replay_queued_webhook_events_v4",
  "run_v4_reconciliation_checks",
  "reconcile_external_settlement_v4",
  "set_cutover_write_freeze_v4",
  "export_v4_delta_for_v3_rollback",
  "expire_stale_holds_v4",
  "claim_refund_for_processing_v4",
  "finalize_refund_payout_v4",
  "claim_due_outbox_events_v4"
]);

export async function invokePostgresRpc(env, v4db, { rpcName, args = {}, role = "authenticated", uid = null, bearerToken = null }) {
  // 1. Hard Environment Isolation Guard (Blocks Staging -> Production writes)
  enforceEnvironmentIsolation(env);

  // 2. Privilege Boundary Enforcement
  if (V4_SERVICE_ROLE_RPCS.has(rpcName) && role !== "service_role") {
    const err = new Error(`FORBIDDEN_RPC_ROLE: RPC ${rpcName} requires service_role execution.`);
    err.code = "42501";
    err.httpStatus = 403;
    throw err;
  }
  if (V4_USER_JWT_RPCS.has(rpcName)) {
    if (role !== "authenticated" || !uid) {
      const err = new Error(`UNAUTHORIZED_RPC_CALL: RPC ${rpcName} requires a verified user JWT (auth.uid()).`);
      err.code = "28000";
      err.httpStatus = 401;
      throw err;
    }
    if (args && typeof args === "object") {
      delete args.user_id;
      delete args.userId;
      delete args.p_user_id;
    }
  }

  const isPostgresRpcEnabled = env && String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpcEnabled) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      const err = new Error("POSTGRES_BACKEND_UNCONFIGURED: Supabase URL or Service Role Key is unconfigured while USE_V4_POSTGRES_RPC=true.");
      err.code = "55000";
      err.httpStatus = 503;
      throw err;
    }

    const baseUrl = normalizeSupabaseUrl(env.SUPABASE_URL);
    const isSupabaseGotrueJwt = (token) => {
      if (!token || typeof token !== "string") return false;
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      try {
        const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
        const payload = JSON.parse(atob(padded));
        return Boolean(payload && typeof payload.sub === "string" && payload.iss && String(payload.iss).includes("supabase"));
      } catch {
        return false;
      }
    };

    const authHeader = role === "service_role" || !bearerToken || !isSupabaseGotrueJwt(bearerToken)
      ? `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
      : `Bearer ${bearerToken}`;

    const timeoutMs = Number(env.SUPABASE_RPC_TIMEOUT_MS) || 8000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res;
    try {
      res = await fetch(`${baseUrl}/rest/v1/rpc/${rpcName}`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args),
        signal: controller.signal
      });
    } catch (fetchErr) {
      clearTimeout(timer);
      if (fetchErr.name === "AbortError") {
        const timeoutError = new Error(`PostgreSQL RPC ${rpcName} timed out after ${timeoutMs}ms.`);
        timeoutError.code = "UPSTREAM_DB_TIMEOUT";
        timeoutError.httpStatus = 504;
        throw timeoutError;
      }
      const netErr = new Error(`PostgreSQL RPC network connection failure: ${fetchErr.message}`);
      netErr.code = "UPSTREAM_DB_NETWORK_ERROR";
      netErr.httpStatus = 502;
      throw netErr;
    } finally {
      clearTimeout(timer);
    }

    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }

    if (!res.ok) {
      const msg = String(data.message || data.error || `PostgreSQL RPC ${rpcName} failed with status ${res.status}`);
      const err = new Error(msg);
      err.code = data.code || (res.status >= 500 ? "50200" : "P0001");
      if (data.code === "55000" || res.status === 503) err.httpStatus = 503;
      else if (data.code === "28000" || res.status === 401) err.httpStatus = 401;
      else if (data.code === "42501" || res.status === 403) err.httpStatus = 403;
      else if (data.code === "P0002" || res.status === 404) err.httpStatus = 404;
      else if (msg.startsWith("PAYMENT_REQUIRED:") || msg.startsWith("PAYMENT_RECONCILIATION_FAILED:")) err.httpStatus = 402;
      else if (msg.startsWith("GONE:")) err.httpStatus = 410;
      else if (
        data.code === "23505" ||
        res.status === 409 ||
        msg.startsWith("HOLD_CONFLICT:") ||
        msg.startsWith("INSUFFICIENT_INVENTORY:") ||
        msg.startsWith("CONFLICT:") ||
        msg.startsWith("RECONCILIATION_LOCKED:")
      ) err.httpStatus = 409;
      else if (data.code === "23514" || data.code === "22023" || res.status === 400) err.httpStatus = 400;
      else if (res.status >= 500) err.httpStatus = 502;
      else err.httpStatus = res.status;
      err.statusCode = err.httpStatus;
      throw err;
    }
    return data;
  }

  return v4db.callRpcAsRole({ role, uid, rpcName, args, env });
}

V4_USER_JWT_RPCS.add("submit_review_v4");
V4_USER_JWT_RPCS.add("get_my_notifications_v4");
V4_USER_JWT_RPCS.add("mark_notification_read_v4");

V4_SERVICE_ROLE_RPCS.add("ensure_user_profile_v4");
V4_SERVICE_ROLE_RPCS.add("ensure_inventory_for_date_v4");

export async function selectPostgresRows(env, { table, query = "select=*" }) {
  enforceEnvironmentIsolation(env);
  if (!env?.SUPABASE_URL || !env?.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  const baseUrl = String(env.SUPABASE_URL).replace(/\/+$/, "");
  const res = await fetch(`${baseUrl}/rest/v1/${table}?${query}`, {
    method: "GET",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    const err = new Error(`Postgres REST SELECT ${table} failed (${res.status}): ${bodyText}`);
    err.statusCode = res.status;
    throw err;
  }
  return res.json();
}

export async function insertPostgresRows(env, { table, rows = [], upsert = false, onConflict = "" } = {}) {
  enforceEnvironmentIsolation(env);
  if (!env?.SUPABASE_URL || !env?.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  const baseUrl = String(env.SUPABASE_URL).replace(/\/+$/, "");
  const qs = upsert && onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : "";
  const prefer = upsert ? "resolution=merge-duplicates,return=representation" : "return=representation";
  const res = await fetch(`${baseUrl}/rest/v1/${table}${qs}`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: prefer
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    const err = new Error(`Postgres REST INSERT ${table} failed (${res.status}): ${bodyText}`);
    err.statusCode = res.status;
    throw err;
  }
  return res.json();
}

