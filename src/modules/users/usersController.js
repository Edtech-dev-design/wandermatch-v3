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

function isPostgresRpcEnabled(env) {
  return Boolean(
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true"
  );
}

function clampPrefScore(value, fallback = 75) {
  if (value === undefined || value === null || value === "") return fallback;
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

export async function handleGetProfileV4({ authUser, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);

  if (isPostgresRpcEnabled(env)) {
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
    const [profileRows, prefRows] = await Promise.all([
      selectPostgresRows(env, {
        table: "profiles",
        query: `select=id,email,full_name,phone,avatar_url,loyalty_tier,loyalty_points,created_at,updated_at&id=eq.${encodeURIComponent(resolvedUid)}`
      }),
      selectPostgresRows(env, {
        table: "user_preferences",
        query: `select=user_id,healing_pref,nature_pref,solitude_pref,comfort_pref,culture_pref,comfort_locks,default_blacklisted_slugs,updated_at&user_id=eq.${encodeURIComponent(resolvedUid)}`
      }).catch(() => [])
    ]);
    const baseProfile = (profileRows && profileRows[0]) || null;
    const prefs = (prefRows && prefRows[0]) || null;
    return {
      success: true,
      source: "supabase_postgres",
      profile: baseProfile ? { ...baseProfile, preferences: prefs } : null
    };
  }

  const profile = (v4db?.tables?.profiles || []).find(p => p.id === resolvedUid) || {
    id: resolvedUid,
    email: user.email,
    full_name: user.name || "WanderMatch Traveler",
    phone: "",
    loyalty_tier: "BRONZE",
    loyalty_points: 0
  };
  const prefs = (v4db?.tables?.user_preferences || []).find(p => p.user_id === resolvedUid) || null;
  return {
    success: true,
    source: "relational_memory",
    profile: { ...profile, preferences: prefs }
  };
}

export async function handleUpdateProfileV4({ authUser, body = {}, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const hasFullName = body.fullName !== undefined || body.full_name !== undefined;
  const fullNameRaw = body.fullName ?? body.full_name ?? user.name ?? "WanderMatch Traveler";
  const fullName = String(fullNameRaw || "").trim();

  if (hasFullName && fullName.length < 2) {
    const err = new Error("VALIDATION_ERROR: fullName must be at least 2 characters.");
    err.statusCode = 400;
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  const phone = body.phone !== undefined ? String(body.phone || "").trim().slice(0, 20) : undefined;
  const originAirport = String(body.originAirport || body.origin || "SGN").trim().toUpperCase();
  const validAirport = ["SGN", "HAN", "DAD"].includes(originAirport) ? originAirport : "SGN";
  const budgetVnd = Math.max(1000000, Number(body.budgetPerPersonVnd || body.budget || 5000000) || 5000000);
  const blacklistedSlugs = Array.isArray(body.blacklistedSlugs || body.blacklist)
    ? (body.blacklistedSlugs || body.blacklist).map(s => String(s).trim()).filter(Boolean)
    : [];

  const existingPref = (v4db?.tables?.user_preferences || []).find(p => p.user_id === resolvedUid) || {};
  const nextComfortLocks = {
    ...(existingPref.comfort_locks || { no_red_eye: true, min_stars: 4, baggage_kg: 20 }),
    ...(body.comfortLocks && typeof body.comfortLocks === "object" ? body.comfortLocks : {}),
    origin_airport: validAirport,
    budget_per_person_vnd: budgetVnd
  };

  const prefRow = {
    user_id: resolvedUid,
    healing_pref: clampPrefScore(body.healingPref ?? body.userPreferences?.healing, existingPref.healing_pref ?? 75),
    nature_pref: clampPrefScore(body.naturePref ?? body.userPreferences?.nature, existingPref.nature_pref ?? 75),
    solitude_pref: clampPrefScore(body.solitudePref ?? body.userPreferences?.solitude, existingPref.solitude_pref ?? 75),
    comfort_pref: clampPrefScore(body.comfortPref ?? body.userPreferences?.comfort, existingPref.comfort_pref ?? 75),
    culture_pref: clampPrefScore(body.culturePref ?? body.userPreferences?.culture, existingPref.culture_pref ?? 75),
    comfort_locks: nextComfortLocks,
    default_blacklisted_slugs: blacklistedSlugs,
    updated_at: new Date().toISOString()
  };

  if (typeof v4db?._ensureUserProfileInTables === "function") {
    v4db._ensureUserProfileInTables(v4db.tables, {
      userId: resolvedUid,
      email: user.email || `${resolvedUid}@wandermatch.local`,
      fullName: fullName || user.name || "WanderMatch Traveler"
    });
  }

  let memProfile = (v4db?.tables?.profiles || []).find(p => p.id === resolvedUid);
  if (memProfile) {
    if (fullName) memProfile.full_name = fullName;
    if (phone !== undefined) memProfile.phone = phone;
    if (body.avatarUrl !== undefined) memProfile.avatar_url = String(body.avatarUrl || "").trim() || null;
    memProfile.updated_at = new Date().toISOString();
  }
  if (v4db?.tables?.user_preferences) {
    const idx = v4db.tables.user_preferences.findIndex(p => p.user_id === resolvedUid);
    if (idx >= 0) {
      v4db.tables.user_preferences[idx] = { ...v4db.tables.user_preferences[idx], ...prefRow };
    } else {
      v4db.tables.user_preferences.push(prefRow);
    }
  }

  if (isPostgresRpcEnabled(env)) {
    await invokePostgresRpc(env, v4db, {
      rpcName: "ensure_user_profile_v4",
      role: "service_role",
      args: {
        p_user_id: resolvedUid,
        p_email: user.email || `${resolvedUid}@wandermatch.local`,
        p_full_name: fullName || user.name || "WanderMatch Traveler",
        p_role: user.isAdmin ? "admin" : "traveler"
      }
    });
    const profileUpsertRow = {
      id: resolvedUid,
      email: user.email || `${resolvedUid}@wandermatch.local`,
      full_name: fullName || memProfile?.full_name || user.name || "WanderMatch Traveler",
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(body.avatarUrl !== undefined ? { avatar_url: String(body.avatarUrl || "").trim() || null } : {}),
      updated_at: new Date().toISOString()
    };
    const [savedProfileRows, savedPrefRows] = await Promise.all([
      insertPostgresRows(env, {
        table: "profiles",
        rows: [profileUpsertRow],
        upsert: true,
        onConflict: "id"
      }),
      insertPostgresRows(env, {
        table: "user_preferences",
        rows: [prefRow],
        upsert: true,
        onConflict: "user_id"
      })
    ]);
    const savedProfile = (savedProfileRows && savedProfileRows[0]) || profileUpsertRow;
    const savedPref = (savedPrefRows && savedPrefRows[0]) || prefRow;
    return {
      success: true,
      source: "supabase_postgres",
      profile: { ...savedProfile, preferences: savedPref }
    };
  }

  return {
    success: true,
    source: "relational_memory",
    profile: { ...(memProfile || { id: resolvedUid, email: user.email, full_name: fullName, phone: phone || null }), preferences: prefRow }
  };
}
