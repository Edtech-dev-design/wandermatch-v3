// ============================================================================
// WANDERMATCH V4.2 — CANONICAL MODULAR WORKER ENTRYPOINT (src/index.js)
// Enforces Environment Isolation Guard before storage/DB access, applies CORS
// and rate limiting, dispatches /api/v4/* to modular controllers, and preserves
// legacy /api/* endpoints via worker.js fallback without duplicating logic.
// ============================================================================

import {
  handler as legacyHandler,
  authenticateRequest,
  verifyWebhookAuthentication,
  handleAuth,
  withStorageLock,
  hydrate,
  persist,
  STORAGE,
  hashPassword,
  verifyToken,
  getV4Db,
  V4_USER_JWT_RPCS,
  V4_SERVICE_ROLE_RPCS
} from "../worker.js";
import {
  enforceEnvironmentIsolation,
  validateRuntimeEnvironment,
  PRODUCTION_SUPABASE_PROJECT_REF,
  STAGING_SUPABASE_PROJECT_REF
} from "./middleware/envIsolationGuard.js";
import { resolveCorsHeaders } from "./middleware/corsMiddleware.js";
import { checkRateLimit } from "./middleware/rateLimitMiddleware.js";
import { generateRequestId, redactSecrets, createStructuredLogger } from "./utils/logger.js";
import { executeResilientDualAICoPilot } from "./modules/ai/aiCoPilotService.js";
import { V41_ROUTE_REGISTRY, V42_ROUTE_REGISTRY, dispatchV4Route } from "./router/apiRouter.js";

export {
  V4_USER_JWT_RPCS,
  V4_SERVICE_ROLE_RPCS,
  enforceEnvironmentIsolation,
  validateRuntimeEnvironment,
  PRODUCTION_SUPABASE_PROJECT_REF,
  STAGING_SUPABASE_PROJECT_REF,
  generateRequestId,
  redactSecrets,
  createStructuredLogger,
  executeResilientDualAICoPilot,
  V41_ROUTE_REGISTRY,
  V42_ROUTE_REGISTRY
};

function cloneSnapshot(obj) {
  try {
    return structuredClone(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
}

function attachTracingHeaders(response, requestId, env) {
  const headers = new Headers(response.headers);
  if (requestId && !headers.has("X-Request-Id")) {
    headers.set("X-Request-Id", requestId);
  }
  if (env?.ENVIRONMENT && !headers.has("X-Environment")) {
    headers.set("X-Environment", String(env.ENVIRONMENT).toLowerCase());
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env, ctx) {
    const requestId = request.headers.get("X-Request-Id") || generateRequestId();
    const logger = createStructuredLogger(env, requestId);
    const url = new URL(request.url);
    const { isAllowed, corsHeaders, requestOrigin } = resolveCorsHeaders(request, env);

    // 1. Fail-closed Environment Isolation Guard BEFORE any DB or storage access
    try {
      enforceEnvironmentIsolation(env, { path: url.pathname, requestId });
    } catch (isolationErr) {
      logger.error("SECURITY_EVENT_ENV_ISOLATION_VIOLATION", {
        path: url.pathname,
        code: isolationErr?.code || "ENV_ISOLATION_VIOLATION",
        reason: isolationErr?.reason || isolationErr?.message
      });
      return new Response(
        JSON.stringify({
          success: false,
          error: isolationErr?.code || "ENV_ISOLATION_VIOLATION",
          code: isolationErr?.code || "ENV_ISOLATION_VIOLATION",
          reason: isolationErr?.reason || isolationErr?.message,
          message: isolationErr?.message || "Environment isolation check failed."
        }),
        {
          status: isolationErr?.statusCode || 503,
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId }
        }
      );
    }

    // 2. CORS preflight & origin enforcement
    if (request.method === "OPTIONS") {
      if (!isAllowed) {
        return new Response(JSON.stringify({ success: false, error: "CORS origin denied.", requestId }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId }
        });
      }
      return new Response(null, { status: 204, headers: { ...corsHeaders, "X-Request-Id": requestId } });
    }

    if (requestOrigin && !isAllowed && url.pathname.startsWith("/api/v4/") && url.pathname !== "/api/v4/webhooks/payment") {
      return new Response(JSON.stringify({ success: false, error: "CORS origin denied.", code: "CORS_ORIGIN_DENIED", requestId }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId }
      });
    }

    // 3. Sliding-window rate limit check
    const rate = checkRateLimit(request);
    if (!rate.allowed) {
      return new Response(
        JSON.stringify({ success: false, error: "RATE_LIMIT_EXCEEDED", message: "Too many requests.", requestId }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))),
            "X-Request-Id": requestId
          }
        }
      );
    }

    // 4. Transactional Storage Lock + Modular V4 Dispatch + Legacy Fallback
    return withStorageLock(async () => {
      await hydrate(env);
      const preSnapshot = cloneSnapshot(STORAGE);
      try {
        let response;
        const routed = await dispatchV4Route(request, env, ctx, {
          url,
          v4db: getV4Db(),
          storage: STORAGE,
          hashPassword,
          verifyToken,
          authenticateRequest,
          verifyWebhookAuthentication,
          handleAuth,
          logger,
          corsHeaders,
          requestId
        });

        if (routed && routed.matched) {
          response = routed.response;
        } else {
          response = await legacyHandler.fetch(request, env, ctx);
        }

        if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method.toUpperCase()) && response.status < 500) {
          await persist(env);
        }
        return attachTracingHeaders(response, requestId, env);
      } catch (err) {
        for (const k of Object.keys(STORAGE)) delete STORAGE[k];
        Object.assign(STORAGE, preSnapshot);
        logger.error("UNHANDLED_WORKER_EXCEPTION", { path: url.pathname, error: err?.message });
        return new Response(
          JSON.stringify({
            success: false,
            error: err?.message || "Internal server error",
            code: err?.code || "INTERNAL_ERROR",
            requestId
          }),
          {
            status: err?.statusCode || 500,
            headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId }
          }
        );
      }
    });
  }
};
