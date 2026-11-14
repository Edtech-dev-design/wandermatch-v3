// ============================================================================
// WANDERMATCH V4.2 — FRONTEND ENVIRONMENT CONFIGURATION & ISOLATION GUARD
// Enforces 3-tier isolation: development / staging / production
// Zero fallback from Staging to Production. Zero Service Role Keys on client.
// ============================================================================

export const PRODUCTION_PROJECT_REF = "iwuehabwpihnpahuhqki";
export const STAGING_PROJECT_REF = "hpwtdlffidfircparanl";
export const STAGING_WORKER_URL = "https://wandermatch-api-staging.vannong20182018.workers.dev";
export const PRODUCTION_WORKER_URL = "https://wandermatch-api.vannong20182018.workers.dev";

export const ENVIRONMENT_MATRIX = Object.freeze({
  development: {
    name: "development",
    gitBranch: "feat/v4-architecture",
    workerName: "wandermatch-api-dev",
    apiBase: "http://127.0.0.1:8787",
    supabaseUrl: "http://127.0.0.1:54321",
    supabaseProjectRef: "local-dev",
    allowProductionConnection: false
  },
  staging: {
    name: "staging",
    gitBranch: "feat/v4-architecture",
    workerName: "wandermatch-api-staging",
    apiBase: STAGING_WORKER_URL,
    supabaseUrl: `https://${STAGING_PROJECT_REF}.supabase.co`,
    supabaseProjectRef: STAGING_PROJECT_REF,
    allowProductionConnection: false
  },
  production: {
    name: "production",
    gitBranch: "main",
    workerName: "wandermatch-api",
    apiBase: "https://wandermatch.vn",
    supabaseUrl: `https://${PRODUCTION_PROJECT_REF}.supabase.co`,
    supabaseProjectRef: PRODUCTION_PROJECT_REF,
    allowProductionConnection: true
  }
});

function decodeFrontendJwt(token = "") {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function resolveFrontendEnvironment(hostname = "localhost", port = "") {
  const host = String(hostname || "localhost").toLowerCase().trim();
  const isLocal = host === "localhost" || host === "127.0.0.1";
  const isProd =
    host === "wandermatch.vn" ||
    host === "www.wandermatch.vn" ||
    host === "wandermatch-v3.vercel.app";

  const tier = isLocal ? "development" : isProd ? "production" : "staging";
  const baseConfig = ENVIRONMENT_MATRIX[tier];

  return {
    ...baseConfig,
    environment: baseConfig.name,
    apiBase: isLocal && port && port !== "3000" && port !== "5500"
      ? `http://${host}:${port}`
      : baseConfig.apiBase
  };
}

export function validateFrontendEnvironment(config) {
  const envName = config?.name || config?.environment;
  if (!config || !ENVIRONMENT_MATRIX[envName]) {
    return { ok: false, code: "ENV_ISOLATION_VIOLATION", reason: "MISSING_OR_INVALID_FRONTEND_ENV" };
  }

  const urlStr = String(config.supabaseUrl || "").trim();
  const apiStr = String(config.apiBase || "").trim();
  const anonKey = String(config.supabaseAnonKey || "");
  const payload = decodeFrontendJwt(anonKey);

  if (payload?.role === "service_role") {
    return { ok: false, code: "FRONTEND_SERVICE_ROLE_KEY_FORBIDDEN", reason: "SERVICE_ROLE_IN_FRONTEND" };
  }

  if (envName !== "production") {
    if (
      urlStr.includes(PRODUCTION_PROJECT_REF) ||
      urlStr.includes("wandermatch-v3") ||
      config.supabaseProjectRef === PRODUCTION_PROJECT_REF ||
      payload?.ref === PRODUCTION_PROJECT_REF
    ) {
      return {
        ok: false,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "NON_PROD_CONNECTING_TO_PRODUCTION_SUPABASE",
        message: `ENV_ISOLATION_VIOLATION: Environment '${envName}' is strictly forbidden from connecting to Production Supabase (${PRODUCTION_PROJECT_REF}).`
      };
    }

    if (
      apiStr === "https://wandermatch.vn" ||
      apiStr === "https://www.wandermatch.vn" ||
      apiStr === PRODUCTION_WORKER_URL
    ) {
      return {
        ok: false,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "NON_PROD_TARGETING_PRODUCTION_API",
        message: `ENV_ISOLATION_VIOLATION: Environment '${envName}' is strictly forbidden from targeting Production API endpoint.`
      };
    }
  }

  if (envName === "staging") {
    const refOk = urlStr.includes(STAGING_PROJECT_REF) && (!config.supabaseProjectRef || config.supabaseProjectRef === STAGING_PROJECT_REF);
    if (!refOk) {
      return {
        ok: false,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "STAGING_PROJECT_REF_MISMATCH",
        message: `ENV_ISOLATION_VIOLATION: Staging frontend must target '${STAGING_PROJECT_REF}'.`
      };
    }
  }

  return { ok: true, environment: envName };
}

export function assertStagingNotConnectedToProduction(config) {
  const check = validateFrontendEnvironment(config);
  if (!check.ok) {
    throw new Error(check.message || `${check.code}: ${check.reason}`);
  }
  return true;
}
