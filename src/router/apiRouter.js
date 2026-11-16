// ============================================================================
// WANDERMATCH V4.2 — MODULAR V4 API ROUTER & DISPATCHER
// ============================================================================

import { handleCreateRecommendationsV4, handleGetCatalogV4 } from "../modules/discovery/discoveryController.js";
import { handleGetSealedPackagesV4, handleRevealBlindBookingV4 } from "../modules/blind-booking/blindBookingController.js";
import { handleCreateBookingWithHoldV4, handleGetBookingStatusV4, handleListMyBookingsV4 } from "../modules/booking/bookingController.js";
import { handlePaymentWebhookV4, handleRequestRefundV4, handleFinalizeRefundV4 } from "../modules/payment/paymentController.js";
import { handleGetMaskedPiiV4, handleUpsertPiiV4, handleGetProfileV4, handleUpdateProfileV4 } from "../modules/users/usersController.js";
import {
  handleApproveRefundV4,
  handleGetAdminSummaryV4,
  handleRunReconciliationV4,
  handleReconcileSettlementV4,
  handleCutoverWriteFreezeV4,
  handleReplayQueuedWebhooksV4,
  handleRollbackRehearsalV4
} from "../modules/admin/adminController.js";
import { handleGetAuthMeV4, handleLoginV4, handleRegisterV4, handleForgotPasswordV4, handleResetPasswordV4 } from "../modules/auth/authController.js";
import { handleSubmitReviewV4, handleGetReviewsV4 } from "../modules/reviews/reviewsController.js";
import { handleGetNotificationsV4, handleMarkNotificationReadV4 } from "../modules/notifications/notificationsController.js";

// Keep exact 11 V4.1 registry entries for backwards-compatibility checks
export const V41_ROUTE_REGISTRY = Object.freeze({
  "POST /api/v4/recommendations": handleCreateRecommendationsV4,
  "GET /api/v4/packages/sealed": handleGetSealedPackagesV4,
  "POST /api/v4/bookings": handleCreateBookingWithHoldV4,
  "POST /api/v4/webhooks/payment": handlePaymentWebhookV4,
  "POST /api/v4/bookings/reveal": handleRevealBlindBookingV4,
  "POST /api/v4/refunds/request": handleRequestRefundV4,
  "POST /api/v4/refunds/approve": handleApproveRefundV4,
  "GET /api/v4/pii/masked": handleGetMaskedPiiV4,
  "GET /api/v4/reconciliation": handleRunReconciliationV4,
  "POST /api/v4/reconciliation/settlement": handleReconcileSettlementV4,
  "POST /api/v4/cutover/write-freeze": handleCutoverWriteFreezeV4
});

export const V42_ROUTE_REGISTRY = Object.freeze({
  ...V41_ROUTE_REGISTRY,
  "GET /api/v4/auth/me": handleGetAuthMeV4,
  "POST /api/v4/auth/login": handleLoginV4,
  "POST /api/v4/auth/register": handleRegisterV4,
  "POST /api/v4/auth/forgot-password": handleForgotPasswordV4,
  "POST /api/v4/auth/reset-password": handleResetPasswordV4,
  "GET /api/v4/discovery/catalog": handleGetCatalogV4,
  "GET /api/v4/bookings": handleListMyBookingsV4,
  "GET /api/v4/bookings/status": handleGetBookingStatusV4,
  "POST /api/v4/refunds/finalize": handleFinalizeRefundV4,
  "GET /api/v4/reviews": handleGetReviewsV4,
  "POST /api/v4/reviews": handleSubmitReviewV4,
  "GET /api/v4/notifications": handleGetNotificationsV4,
  "POST /api/v4/notifications/read": handleMarkNotificationReadV4,
  "POST /api/v4/pii/upsert": handleUpsertPiiV4,
  "GET /api/v4/users/profile": handleGetProfileV4,
  "PUT /api/v4/users/profile": handleUpdateProfileV4,
  "POST /api/v4/users/profile": handleUpdateProfileV4,
  "GET /api/v4/admin/summary": handleGetAdminSummaryV4,
  "POST /api/v4/cutover/replay-webhooks": handleReplayQueuedWebhooksV4,
  "POST /api/v4/cutover/rollback-rehearsal": handleRollbackRehearsalV4
});

async function parseJsonBodyStrict(request) {
  const raw = await request.text();
  if (!raw || !raw.trim()) return {};
  if (raw.length > 262144) {
    const err = new Error("PAYLOAD_TOO_LARGE: Request body exceeds 256KB limit.");
    err.code = "PAYLOAD_TOO_LARGE";
    err.statusCode = 413;
    throw err;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      const err = new Error("INVALID_JSON: Request body must be a JSON object.");
      err.code = "INVALID_JSON";
      err.statusCode = 400;
      throw err;
    }
    return parsed;
  } catch (e) {
    if (e.statusCode) throw e;
    const err = new Error("INVALID_JSON: Malformed JSON request body.");
    err.code = "INVALID_JSON";
    err.statusCode = 400;
    throw err;
  }
}

function extractBearerToken(request) {
  const auth = request.headers.get("Authorization") || "";
  return auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;
}

function makeJsonResponse(payload, status = 200, corsHeaders = {}, requestId = null) {
  const headers = {
    ...(corsHeaders || {}),
    "Content-Type": "application/json",
    ...(requestId ? { "X-Request-Id": requestId } : {})
  };
  return new Response(JSON.stringify(payload), { status, headers });
}

function resolveErrorStatus(err) {
  if (!err) return 500;
  const explicitStatus = err.statusCode ?? err.httpStatus ?? err.status;
  if (typeof explicitStatus === "number" && explicitStatus >= 400) return explicitStatus;
  const msg = String(err.message || "");
  if (
    err.code === "INVALID_JSON" ||
    err.code === "22023" ||
    err.code === "23514" ||
    /INVALID_JSON|BAD_REQUEST|INVALID_AMOUNT|MISSING_/i.test(msg)
  ) {
    return 400;
  }
  if (err.code === "28000" || /UNAUTHORIZED/i.test(msg)) return 401;
  if (err.code === "42501" || /FORBIDDEN|CROSS_TENANT|ACCESS_DENIED|ADMIN ROLE/i.test(msg)) return 403;
  if (err.code === "P0002" || /NOT_FOUND/i.test(msg)) return 404;
  if (/INSUFFICIENT_ANONYMITY_POOL|NO_ELIGIBLE|VALIDATION/i.test(msg)) return 422;
  if (
    err.code === "P0001" ||
    /CONFLICT|EARLY_REVEAL|NOT_PAID|HOLD_EXPIRED|ALREADY|SOLD_OUT|INSUFFICIENT_INVENTORY|EXPIRED/i.test(msg)
  ) {
    return 409;
  }
  return 500;
}

export async function dispatchV4Route(
  request,
  env,
  ctx,
  { url, v4db, storage, hashPassword, verifyToken, authenticateRequest, verifyWebhookAuthentication, handleAuth, corsHeaders = {}, requestId = null }
) {
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (!path.startsWith("/api/v4/")) {
    return { matched: false };
  }

  // Let canonical /api/v4/health handler run its live Supabase probe cleanly without duplication
  if (path === "/api/v4/health" && method === "GET") {
    return { matched: false };
  }

  try {
    // 1. V4 Auth routes
    if (path === "/api/v4/auth/register" && method === "POST") {
      const response = await handleRegisterV4({
        request,
        env,
        v4db,
        handleLegacyAuth: handleAuth,
        corsHeaders
      });
      return { matched: true, response };
    }
    if (path === "/api/v4/auth/login" && method === "POST") {
      const response = await handleLoginV4({
        request,
        env,
        v4db,
        handleLegacyAuth: handleAuth,
        corsHeaders
      });
      return { matched: true, response };
    }
    if (path === "/api/v4/auth/me" && method === "GET") {
      const authUser = await authenticateRequest(request, env);
      const data = await handleGetAuthMeV4({ authUser });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/auth/forgot-password" && method === "POST") {
      const response = await handleForgotPasswordV4({
        request,
        env,
        storage,
        corsHeaders
      });
      return { matched: true, response };
    }
    if (path === "/api/v4/auth/reset-password" && method === "POST") {
      const response = await handleResetPasswordV4({
        request,
        env,
        storage,
        hashPassword,
        verifyToken,
        corsHeaders
      });
      return { matched: true, response };
    }

    // 2. Public Discovery Catalog & Approved Reviews
    if (path === "/api/v4/discovery/catalog" && method === "GET") {
      const data = await handleGetCatalogV4({ env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/reviews" && method === "GET") {
      const limit = Number(url.searchParams.get("limit") || 20);
      const data = await handleGetReviewsV4({ env, v4db, limit });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }

    // 3. Payment Webhook (HMAC / Secret authenticated — no user JWT)
    if ((path === "/api/v4/webhooks/payment" || path === "/api/v4/payments/webhook") && method === "POST") {
      const sigAuth = await verifyWebhookAuthentication(request, env);
      if (!sigAuth.ok) {
        return {
          matched: true,
          response: makeJsonResponse({ success: false, error: sigAuth.error }, sigAuth.status || 401, corsHeaders, requestId)
        };
      }
      const body = await parseJsonBodyStrict(request);
      const data = await handlePaymentWebhookV4({ body, env, v4db });
      const webhookStatus = Number(data?.http_status) || (data?.success === false ? 400 : 200);
      return {
        matched: true,
        response: makeJsonResponse({ success: data?.success !== false, ...data }, webhookStatus, corsHeaders, requestId)
      };
    }

    // 4. Authenticated User & Admin Routes
    const authUser = await authenticateRequest(request, env);
    const bearerToken = extractBearerToken(request);

    if (path === "/api/v4/recommendations" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleCreateRecommendationsV4({ authUser, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/packages/sealed" && method === "GET") {
      const sessionId = url.searchParams.get("sessionId");
      const data = await handleGetSealedPackagesV4({ authUser, bearerToken, sessionId, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/bookings" && method === "GET") {
      const data = await handleListMyBookingsV4({ authUser, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/bookings" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleCreateBookingWithHoldV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/bookings/status" && method === "GET") {
      const bookingCode = url.searchParams.get("bookingCode");
      const data = await handleGetBookingStatusV4({ authUser, bearerToken, bookingCode, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/bookings/reveal" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleRevealBlindBookingV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/refunds/request" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleRequestRefundV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/refunds/approve" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleApproveRefundV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/refunds/finalize" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleFinalizeRefundV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/pii/masked" && method === "GET") {
      const data = await handleGetMaskedPiiV4({ authUser, bearerToken, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/pii/upsert" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleUpsertPiiV4({ authUser, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/users/profile" && method === "GET") {
      const data = await handleGetProfileV4({ authUser, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/users/profile" && (method === "PUT" || method === "POST")) {
      const body = await parseJsonBodyStrict(request);
      const data = await handleUpdateProfileV4({ authUser, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/reviews" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleSubmitReviewV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/notifications" && method === "GET") {
      const limit = Number(url.searchParams.get("limit") || 20);
      const data = await handleGetNotificationsV4({ authUser, bearerToken, limit, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/notifications/read" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleMarkNotificationReadV4({ authUser, bearerToken, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/admin/summary" && method === "GET") {
      const data = await handleGetAdminSummaryV4({ authUser, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/reconciliation" && method === "GET") {
      const data = await handleRunReconciliationV4({ authUser, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/reconciliation/settlement" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleReconcileSettlementV4({ authUser, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/cutover/write-freeze" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleCutoverWriteFreezeV4({ authUser, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/cutover/replay-webhooks" && method === "POST") {
      const body = await parseJsonBodyStrict(request);
      const data = await handleReplayQueuedWebhooksV4({ authUser, body, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }
    if (path === "/api/v4/cutover/rollback-rehearsal" && method === "POST") {
      const data = await handleRollbackRehearsalV4({ authUser, env, v4db });
      return { matched: true, response: makeJsonResponse(data, 200, corsHeaders, requestId) };
    }

    return {
      matched: true,
      response: makeJsonResponse({ success: false, error: `Unknown V4 endpoint: ${method} ${path}` }, 404, corsHeaders, requestId)
    };
  } catch (err) {
    const status = resolveErrorStatus(err);
    return {
      matched: true,
      response: makeJsonResponse(
        {
          success: false,
          error: err?.message || "V4 API error",
          code: err?.code || "V4_API_ERROR"
        },
        status,
        corsHeaders,
        requestId
      )
    };
  }
}
