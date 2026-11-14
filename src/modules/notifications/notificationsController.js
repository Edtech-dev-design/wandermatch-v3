// ============================================================================
// WANDERMATCH V4.2 — BACKEND NOTIFICATIONS DOMAIN CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleGetNotificationsV4({ authUser, bearerToken, limit = 20, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "get_my_notifications_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: { p_limit: Math.max(1, Math.min(100, Number(limit || 20))) }
  });
  return { success: true, ...(data || {}) };
}

export async function handleMarkNotificationReadV4({ authUser, bearerToken, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const notificationId = body.notificationId || body.p_notification_id || body.id;
  if (!notificationId) {
    const err = new Error("notificationId is required.");
    err.statusCode = 400;
    throw err;
  }

  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "mark_notification_read_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: { p_notification_id: notificationId }
  });
  return { success: true, ...(data || {}) };
}
