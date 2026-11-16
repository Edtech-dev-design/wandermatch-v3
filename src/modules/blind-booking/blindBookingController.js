// ============================================================================
// WANDERMATCH V4.1 — BACKEND BLIND BOOKING & REVEAL CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleGetSealedPackagesV4({ authUser, bearerToken, sessionId, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  if (!sessionId) {
    const err = new Error("Missing sessionId query parameter");
    err.httpStatus = 400;
    throw err;
  }
  const packages = await invokePostgresRpc(env, v4db, {
    rpcName: "get_my_sealed_packages_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: { p_session_id: sessionId }
  });
  return { success: true, session_id: sessionId, packages };
}

export async function handleRevealBlindBookingV4({ authUser, bearerToken, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const bookingCode = String(body?.bookingCode || body?.p_booking_code || "").trim().toUpperCase();
  if (!bookingCode) {
    const err = new Error("bookingCode is required.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "reveal_blind_booking_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: {
      p_booking_code: bookingCode
    }
  });
  return { success: true, ...data };
}

