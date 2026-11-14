// ============================================================================
// WANDERMATCH V4.2 — BACKEND USER PROFILE & PII VAULT CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc, insertPostgresRows, selectPostgresRows } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleGetMaskedPiiV4({ authUser, bearerToken, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "get_my_masked_pii_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: {}
  });
  return { success: true, ...data };
}

export async function handleUpsertPiiV4({ authUser, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);

  const cccdPlaintext = String(body.cccd || body.cccdPlaintext || "").trim();
  const refundBankCode = String(body.refundBankCode || body.bankCode || "").trim().toUpperCase();
  const refundBankAccount = String(body.refundBankAccount || body.bankAccount || "").trim();
  const refundBankHolder = String(body.refundBankHolder || body.bankHolder || "").trim().toUpperCase();

  if (!cccdPlaintext || !refundBankCode || !refundBankAccount || !refundBankHolder) {
    const err = new Error("cccd, refundBankCode, refundBankAccount, and refundBankHolder are required.");
    err.statusCode = 400;
    throw err;
  }

  if (typeof v4db?._ensureUserProfileInTables === "function") {
    v4db._ensureUserProfileInTables(v4db.tables, {
      userId: resolvedUid,
      email: user.email || null,
      fullName: user.name || null
    });
  }

  const saved = await v4db.upsertUserSensitivePii({
    userId: resolvedUid,
    cccdPlaintext,
    refundBankCode,
    refundBankAccount,
    refundBankHolder,
    env
  });

  const isPostgresRpc =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpc) {
    await invokePostgresRpc(env, v4db, {
      rpcName: "ensure_user_profile_v4",
      role: "service_role",
      args: {
        p_user_id: resolvedUid,
        p_email: user.email || `${resolvedUid}@wandermatch.local`,
        p_full_name: user.name || "WanderMatch Traveler",
        p_role: user.isAdmin ? "admin" : "traveler"
      }
    });
    const localRow = v4db.tables.user_sensitive_pii.find(p => p.user_id === resolvedUid);
    if (localRow) {
      await insertPostgresRows(env, {
        table: "user_sensitive_pii",
        rows: [localRow],
        upsert: true,
        onConflict: "user_id"
      });
    }
  }

  return {
    success: true,
    user_id: resolvedUid,
    cccd_last4: saved.cccd_last4,
    refund_bank_code: saved.refund_bank_code,
    refund_bank_account_last4: saved.refund_bank_account_last4
  };
}

export async function handleGetProfileV4({ authUser, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);

  const isPostgresRpc =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpc) {
    await invokePostgresRpc(env, v4db, {
      rpcName: "ensure_user_profile_v4",
      role: "service_role",
      args: {
        p_user_id: resolvedUid,
        p_email: user.email || `${resolvedUid}@wandermatch.local`,
        p_full_name: user.name || "WanderMatch Traveler",
        p_role: user.isAdmin ? "admin" : "traveler"
      }
    });
    const rows = await selectPostgresRows(env, {
      table: "profiles",
      query: `select=id,email,full_name,phone,avatar_url,loyalty_tier,loyalty_points,created_at&id=eq.${encodeURIComponent(resolvedUid)}`
    });
    return { success: true, source: "supabase_postgres", profile: (rows && rows[0]) || null };
  }

  const profile = (v4db?.tables?.profiles || []).find(p => p.id === resolvedUid) || {
    id: resolvedUid,
    email: user.email,
    full_name: user.name || "WanderMatch Traveler",
    loyalty_tier: "BRONZE",
    loyalty_points: 0
  };
  return { success: true, source: "relational_memory", profile };
}
