// ============================================================================
// WANDERMATCH V4.2 — BACKEND REVIEWS DOMAIN CONTROLLER
// ============================================================================

import { requireAuthenticatedUser } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc, selectPostgresRows } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleSubmitReviewV4({ authUser, bearerToken, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const bookingCode = String(body.bookingCode || body.p_booking_code || "").trim().toUpperCase();
  const rating = Number(body.rating ?? body.p_rating ?? 5);
  const aiMatchRating = Number(body.aiMatchRating ?? body.p_ai_match_rating ?? rating);
  const reviewText = String(body.reviewText || body.p_review_text || "Chuyến đi ẩn số tuyệt vời!");

  if (!bookingCode) {
    const err = new Error("bookingCode is required.");
    err.statusCode = 400;
    throw err;
  }

  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "submit_review_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: {
      p_booking_code: bookingCode,
      p_rating: rating,
      p_ai_match_rating: aiMatchRating,
      p_review_text: reviewText
    }
  });
  return { success: true, ...data };
}

export async function handleGetReviewsV4({ env, v4db, limit = 20 }) {
  const safeLimit = Math.max(1, Math.min(100, Number(limit || 20)));
  const isPostgresRpc =
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true";

  if (isPostgresRpc) {
    const rows = await selectPostgresRows(env, {
      table: "reviews",
      query: `select=id,booking_id,rating,ai_match_rating,review_text,moderation_status,created_at&moderation_status=eq.APPROVED&order=created_at.desc&limit=${safeLimit}`
    });
    return { success: true, source: "supabase_postgres", reviews: rows || [] };
  }

  const reviews = (v4db?.tables?.reviews || [])
    .filter(r => r.moderation_status === "APPROVED")
    .slice(0, safeLimit);
  return { success: true, source: "relational_memory", reviews };
}
