// ============================================================================
// WANDERMATCH V4.2 — BACKEND BOOKING DOMAIN CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc, selectPostgresRows } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleCreateBookingWithHoldV4({ authUser, bearerToken, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);

  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "create_booking_with_hold_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: {
      p_package_id: body.packageId || body.p_package_id,
      p_booking_code:
        body.bookingCode ||
        body.p_booking_code ||
        (String(env?.USE_V4_POSTGRES_RPC).toLowerCase() === "true" ? null : v4db.nextBookingCodeV4()),
      p_departure_date: body.departureDate || body.p_departure_date || "2026-11-15",
      p_duration_days: Number(body.durationDays || body.p_duration_days || 3),
      p_travelers: body.travelers || body.p_travelers || []
    }
  });
  return { success: true, ...data };
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

  const isPostgresRpc =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpc) {
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
      booking: {
        id: bk.id,
        booking_code: bk.booking_code,
        package_id: bk.package_id,
        group_size: bk.group_size,
        expected_amount_vnd: bk.expected_amount_vnd,
        paid_amount_vnd: bk.paid_amount_vnd,
        amount_due_vnd: bk.amount_due_vnd,
        overpaid_amount_vnd: bk.overpaid_amount_vnd,
        status: bk.status,
        is_revealed: Boolean(bk.is_revealed),
        revealed_at: bk.is_revealed ? bk.revealed_at : null,
        departure_date: bk.departure_date,
        return_date: bk.return_date,
        hold_expires_at: bk.hold_expires_at
      }
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
    booking: {
      id: bk.id,
      booking_code: bk.booking_code,
      package_id: bk.package_id,
      group_size: bk.group_size,
      expected_amount_vnd: bk.expected_amount_vnd,
      paid_amount_vnd: bk.paid_amount_vnd,
      amount_due_vnd: Math.max(0, Number(bk.expected_amount_vnd || 0) - Number(bk.paid_amount_vnd || 0)),
      status: bk.status,
      is_revealed: Boolean(bk.is_revealed),
      revealed_at: bk.is_revealed ? bk.revealed_at : null,
      departure_date: bk.departure_date,
      return_date: bk.return_date,
      hold_expires_at: bk.hold_expires_at
    }
  };
}
