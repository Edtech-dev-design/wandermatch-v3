// ============================================================================
// WANDERMATCH V4.1 — UNIFIED FRONTEND API CLIENT (CLOUDFLARE WORKER GATEWAY)
// All sensitive operations go strictly through the Cloudflare Worker API.
// Never uses or accepts SUPABASE_SERVICE_ROLE_KEY.
// ============================================================================

import { generateClientRequestId } from "../core/appCore.js";
import { assertStagingNotConnectedToProduction } from "../config/environments.js";

export function createWorkerApiClient({ envConfig, getAccessToken, fetchImpl = globalThis.fetch, onUnauthorized = null }) {
  assertStagingNotConnectedToProduction(envConfig);

  async function request(path, { method = "GET", body = null, headers = {}, requireAuth = false, timeoutMs = 12000 } = {}) {
    const token = typeof getAccessToken === "function" ? await getAccessToken() : null;
    if (requireAuth && !token) {
      const err = new Error("UNAUTHORIZED: Authentication token required.");
      err.status = 401;
      err.code = "UNAUTHORIZED";
      throw err;
    }

    const requestId = generateClientRequestId();
    const reqHeaders = {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      ...headers
    };
    if (token) {
      reqHeaders.Authorization = `Bearer ${token}`;
    }

    const base = String(envConfig?.apiBase || "").replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${base}${normalizedPath}`;

    const hasAbort = typeof AbortController === "function" && Number(timeoutMs) > 0;
    const controller = hasAbort ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), Number(timeoutMs)) : null;

    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
      try {
        window.dispatchEvent(new CustomEvent("wm:v4:network", { detail: { path: normalizedPath, method, state: "pending", requestId } }));
      } catch (_) {}
    }

    try {
      const res = await fetchImpl(url, {
        method,
        headers: reqHeaders,
        body: body !== null ? JSON.stringify(body) : undefined,
        ...(controller ? { signal: controller.signal } : {})
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 && typeof onUnauthorized === "function") {
          try { onUnauthorized(data); } catch (_) {}
        }
        const err = new Error(data.error || data.message || `API request failed (${res.status})`);
        err.status = res.status;
        err.code = data.code || (res.status === 401 ? "UNAUTHORIZED" : "API_ERROR");
        err.requestId = res.headers?.get?.("x-request-id") || requestId;
        throw err;
      }
      return data;
    } catch (err) {
      if (err?.name === "AbortError") {
        const timeoutErr = new Error("API request timed out. Please try again.");
        timeoutErr.status = 504;
        timeoutErr.code = "REQUEST_TIMEOUT";
        timeoutErr.requestId = requestId;
        throw timeoutErr;
      }
      if (!err.requestId) err.requestId = requestId;
      if (!err.code) err.code = err.status ? `HTTP_${err.status}` : "NETWORK_ERROR";
      throw err;
    } finally {
      if (timer) clearTimeout(timer);
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
        try {
          window.dispatchEvent(new CustomEvent("wm:v4:network", { detail: { path: normalizedPath, method, state: "settled", requestId } }));
        } catch (_) {}
      }
    }
  }

  return {
    request,
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
    put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
    delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
    checkHealth: () => request("/api/v4/health", { method: "GET" })
  };
}

