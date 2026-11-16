// ============================================================================
// WANDERMATCH V4.2 — BACKEND DISCOVERY DOMAIN CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc, selectPostgresRows } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleCreateRecommendationsV4({ authUser, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUserId = deterministicUuidV4(user.userId || user.email);

  const rawOrigin = body?.originAirport;
  const originAirport = rawOrigin === undefined || rawOrigin === null || rawOrigin === ""
    ? "SGN"
    : String(rawOrigin).trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(originAirport)) {
    const err = new Error("VALIDATION_ERROR: originAirport must be a 3-letter IATA code.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }

  const rawBudget = body?.budgetPerPersonVnd;
  const budgetPerPersonVnd = rawBudget === undefined || rawBudget === null || rawBudget === ""
    ? 5500000
    : Number(rawBudget);
  if (!Number.isFinite(budgetPerPersonVnd) || budgetPerPersonVnd < 1000000 || budgetPerPersonVnd > 500000000) {
    const err = new Error("VALIDATION_ERROR: budgetPerPersonVnd must be between 1,000,000 and 500,000,000 VND.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }

  const rawGroup = body?.groupSize;
  const groupSize = rawGroup === undefined || rawGroup === null || rawGroup === ""
    ? 2
    : Number(rawGroup);
  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 20) {
    const err = new Error("VALIDATION_ERROR: groupSize must be an integer between 1 and 20.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }

  const rawDuration = body?.durationDays;
  const durationDays = rawDuration === undefined || rawDuration === null || rawDuration === ""
    ? 3
    : Number(rawDuration);
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 30) {
    const err = new Error("VALIDATION_ERROR: durationDays must be an integer between 1 and 30.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }

  const departureDate = String(body?.departureDate || "2026-11-15").trim();

  const isPostgresRpc =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpc) {
    try {
      const invRes = await invokePostgresRpc(env, v4db, {
        rpcName: "ensure_inventory_for_date_v4",
        role: "service_role",
        uid: null,
        args: { p_departure_date: departureDate }
      });
      if (invRes && Array.isArray(invRes.inventories)) {
        v4db.syncRemoteInventoriesForDate(departureDate, invRes.inventories);
      }
    } catch {
      // Fall back to baseline / local clone if remote ensure fails
    }
  }

  // Strictly bind recommendation session to authenticated JWT userId (never body.user_id)
  const result = await v4db.createRecommendationSessionAndPackages({
    userId: resolvedUserId,
    userEmail: user.email || null,
    userName: user.name || user.fullName || null,
    originAirport,
    budgetPerPersonVnd,
    groupSize,
    departureDate,
    durationDays,
    userPreferences: body.userPreferences || {},
    blacklistedSlugs: body.blacklistedSlugs || [],
    comfortLocks: body.comfortLocks || {}
  });

  if (isPostgresRpc) {
    const sessionRow = v4db.tables.recommendation_sessions.find(s => s.id === result.session_id);
    const pkgRows = v4db.tables.packages.filter(p => p.session_id === result.session_id);
    const pkgIds = new Set(pkgRows.map(p => p.id));
    const itemRows = v4db.tables.package_items.filter(i => pkgIds.has(i.package_id));
    const enrichedSession = sessionRow
      ? {
          ...sessionRow,
          user_email: user.email || null,
          user_name: user.name || user.fullName || null
        }
      : sessionRow;
    await invokePostgresRpc(env, v4db, {
      rpcName: "persist_recommendation_session_v4",
      role: "service_role",
      uid: null,
      args: {
        p_session: enrichedSession,
        p_packages: pkgRows,
        p_package_items: itemRows
      }
    });
  }

  return { success: true, ...result };
}

export async function handleGetCatalogV4({ env, v4db }) {
  const isPostgresRpc =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpc) {
    const rows = await selectPostgresRows(env, {
      table: "destinations",
      query: "select=id,code_slug,city_name,province_name,region,climate_bucket_id,climate_zone_label,temp_range_label,is_active&is_active=eq.true&order=city_name.asc"
    });
    return { success: true, source: "supabase_postgres", destinations: rows || [] };
  }

  const localDestinations = (v4db?.tables?.destinations || [])
    .filter(d => d.is_active !== false)
    .map(d => ({
      id: d.id,
      code_slug: d.code_slug,
      city_name: d.city_name,
      province_name: d.province_name,
      region: d.region,
      climate_bucket_id: d.climate_bucket_id,
      climate_zone_label: d.climate_zone_label,
      temp_range_label: d.temp_range_label,
      is_active: d.is_active !== false
    }));

  return { success: true, source: "relational_memory", destinations: localDestinations };
}
