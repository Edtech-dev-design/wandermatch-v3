// ============================================================================
// WANDERMATCH V4.1 — BACKEND BLIND BOOKING & REVEAL CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc } from "../../services/supabase/postgresRpcClient.js";

export async function handleGetSealedPackagesV4({ authUser, bearerToken, sessionId, env, v4db }) {
  requireAuthenticatedUser(authUser);
  if (!sessionId) {
    const err = new Error("Missing sessionId query parameter");
    err.httpStatus = 400;
    throw err;
  }
  const packages = await invokePostgresRpc(env, v4db, {
    rpcName: "get_my_sealed_packages_v4",
    role: "authenticated",
    uid: authUser.userId,
    bearerToken,
    args: { p_session_id: sessionId }
  });
  return { success: true, session_id: sessionId, packages };
}

export async function handleRevealBlindBookingV4({ authUser, bearerToken, body, env, v4db }) {
  requireAuthenticatedUser(authUser);
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "reveal_blind_booking_v4",
    role: "authenticated",
    uid: authUser.userId,
    bearerToken,
    args: {
      p_booking_code: body.bookingCode || body.p_booking_code
    }
  });
  return { success: true, ...data };
}

