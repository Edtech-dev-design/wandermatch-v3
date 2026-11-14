// ============================================================================
// WANDERMATCH V4.1 — UNIFIED FRONTEND API CLIENT (CLOUDFLARE WORKER GATEWAY)
// All sensitive operations go strictly through the Cloudflare Worker API.
// Never uses or accepts SUPABASE_SERVICE_ROLE_KEY.
// ============================================================================

import { generateClientRequestId } from "../core/appCore.js";
import { assertStagingNotConnectedToProduction } from "../config/environments.js";

export function createWorkerApiClient({ envConfig, getAccessToken, fetchImpl = globalThis.fetch }) {
  assertStagingNotConnectedToProduction(envConfig);

  async function request(path, { method = "GET", body = null, headers = {}, requireAuth = false } = {}) {
    const token = typeof getAccessToken === "function" ? await getAccessToken() : null;
    if (requireAuth && !token) {
      const err = new Error("UNAUTHORIZED: Authentication token required.");
      err.status = 401;
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

    const url = `${envConfig.apiBase.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetchImpl(url, {
      method,
      headers: reqHeaders,
      body: body !== null ? JSON.stringify(body) : undefined
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || data.message || `API request failed (${res.status})`);
      err.status = res.status;
      err.code = data.code || "API_ERROR";
      err.requestId = res.headers?.get?.("x-request-id") || requestId;
      throw err;
    }
    return data;
  }

  return {
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
    checkHealth: () => request("/api/health?check=supabase", { method: "GET" })
  };
}

