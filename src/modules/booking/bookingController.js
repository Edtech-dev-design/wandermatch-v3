// ============================================================================
// WANDERMATCH V4.2 — BACKEND BOOKING DOMAIN CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc, selectPostgresRows } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function handleCreateBookingWithHoldV4({ authUser, bearerToken, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);

  const packageId = String(body?.packageId || body?.p_package_id || "").trim();
  if (!UUID_V4_REGEX.test(packageId)) {
    const err = new Error("INVALID_PACKAGE_ID: A valid V4 UUID packageId is required.");
    err.code = "INVALID_PACKAGE_ID";
    err.statusCode = 400;
    throw err;
  }

  const departureDate = String(body?.departureDate || body?.p_departure_date || "2026-11-15").trim();
  if (!ISO_DATE_REGEX.test(departureDate) || Number.isNaN(Date.parse(departureDate))) {
    const err = new Error("INVALID_DEPARTURE_DATE: departureDate must follow YYYY-MM-DD.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }

  const rawDuration = body?.durationDays ?? body?.p_duration_days;
  const durationDays = rawDuration === undefined || rawDuration === null || rawDuration === "" ? 3 : Number(rawDuration);
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 30) {
    const err = new Error("INVALID_DURATION_DAYS: durationDays must be an integer between 1 and 30.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }

  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "create_booking_with_hold_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: {
      p_package_id: packageId,
      p_booking_code:
        body.bookingCode ||
        body.p_booking_code ||
        (String(env?.USE_V4_POSTGRES_RPC).toLowerCase() === "true" ? null : v4db.nextBookingCodeV4()),
      p_departure_date: departureDate,
      p_duration_days: durationDays,
      p_travelers: body.travelers || body.p_travelers || []
    }
  });
  return { success: true, ...data };
}

function isPostgresRpcEnabled(env) {
  return Boolean(
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true"
  );
}

function buildSafeBookingProjection(bk) {
  const expected = Number(bk.expected_amount_vnd || 0);
  const paid = Number(bk.paid_amount_vnd || 0);
  return {
    id: bk.id,
    booking_code: bk.booking_code,
    package_id: bk.package_id,
    group_size: bk.group_size,
    expected_amount_vnd: expected,
    paid_amount_vnd: paid,
    amount_due_vnd: Number(bk.amount_due_vnd ?? Math.max(0, expected - paid)),
    overpaid_amount_vnd: Number(bk.overpaid_amount_vnd ?? Math.max(0, paid - expected)),
    status: bk.status,
    is_revealed: Boolean(bk.is_revealed),
    revealed_at: bk.is_revealed ? bk.revealed_at : null,
    departure_date: bk.departure_date,
    return_date: bk.return_date,
    hold_expires_at: bk.hold_expires_at,
    created_at: bk.created_at || null
  };
}

export async function handleListMyBookingsV4({ authUser, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);

  if (isPostgresRpcEnabled(env)) {
    const rows = await selectPostgresRows(env, {
      table: "bookings",
      query: `select=id,booking_code,user_id,package_id,group_size,expected_amount_vnd,paid_amount_vnd,amount_due_vnd,overpaid_amount_vnd,status,is_revealed,revealed_at,departure_date,return_date,hold_expires_at,created_at&user_id=eq.${encodeURIComponent(resolvedUid)}&order=created_at.desc`
    });
    return {
      success: true,
      source: "supabase_postgres",
      items: (Array.isArray(rows) ? rows : []).map(buildSafeBookingProjection)
    };
  }

  const items = (v4db?.tables?.bookings || [])
    .filter(b => b.user_id === resolvedUid || b.user_id === user.userId)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))
    .map(buildSafeBookingProjection);

  return {
    success: true,
    source: "relational_memory",
    items
  };
}

export async function handleGetBookingStatusV4({ authUser, bookingCode, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const code = String(bookingCode || "").trim().toUpperCase();
  if (!code) {
    const err = new Error("bookingCode query parameter is required.");
    err.statusCode = 400;
    throw err;
  }

  if (isPostgresRpcEnabled(env)) {
    const rows = await selectPostgresRows(env, {
      table: "bookings",
      query: `select=id,booking_code,user_id,package_id,group_size,expected_amount_vnd,paid_amount_vnd,amount_due_vnd,overpaid_amount_vnd,status,is_revealed,revealed_at,departure_date,return_date,hold_expires_at,created_at&booking_code=eq.${encodeURIComponent(code)}`
    });
    const bk = Array.isArray(rows) ? rows[0] : null;
    if (!bk) {
      const err = new Error("Booking not found.");
      err.statusCode = 404;
      throw err;
    }
    if (bk.user_id !== resolvedUid && !user.isAdmin) {
      const err = new Error("FORBIDDEN: Cross-tenant booking status access denied.");
      err.statusCode = 403;
      throw err;
    }
    return {
      success: true,
      source: "supabase_postgres",
      booking: buildSafeBookingProjection(bk)
    };
  }

  const bk = (v4db?.tables?.bookings || []).find(
    b => String(b.booking_code || "").toUpperCase() === code
  );
  if (!bk) {
    const err = new Error("Booking not found.");
    err.statusCode = 404;
    throw err;
  }
  if (bk.user_id !== resolvedUid && bk.user_id !== user.userId && !user.isAdmin) {
    const err = new Error("FORBIDDEN: Cross-tenant booking status access denied.");
    err.statusCode = 403;
    throw err;
  }
  return {
    success: true,
    source: "relational_memory",
    booking: buildSafeBookingProjection(bk)
  };
}
