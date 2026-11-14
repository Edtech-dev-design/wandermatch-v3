// ============================================================================
// WANDERMATCH V4.2 — FAIL-CLOSED ENVIRONMENT ISOLATION GUARD
// Enforces strict 3-tier isolation (development / staging / production),
// validates runtime env identity at startup & before every DB operation,
// and blocks any non-production connection or key matching Production.
// ============================================================================

import { createStructuredLogger } from "../utils/logger.js";

export const PRODUCTION_SUPABASE_PROJECT_REF = "iwuehabwpihnpahuhqki";
export const STAGING_SUPABASE_PROJECT_REF = "hpwtdlffidfircparanl";
export const ALLOWED_ENVIRONMENTS = Object.freeze(["development", "staging", "production"]);

export function normalizeSupabaseUrl(rawUrl = "") {
  return String(rawUrl || "")
    .trim()
    .replace(/hpwtdlffidfjrcparanl\.supabase\.co/gi, "hpwtdlffidfircparanl.supabase.co")
    .replace(/\/+$/, "");
}

export function extractSupabaseProjectRef(supabaseUrl = "") {
  const normalized = normalizeSupabaseUrl(supabaseUrl);
  const m = normalized.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co$/i);
  if (m) return m[1].toLowerCase();
  if (normalized.startsWith("http://127.0.0.1") || normalized.startsWith("http://localhost")) {
    return "local-test-harness";
  }
  return null;
}

export function decodeJwtPayload(token = "") {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function validateRuntimeEnvironment(env = {}) {
  const rawEnv = env?.ENVIRONMENT;
  const environment = typeof rawEnv === "string" ? rawEnv.toLowerCase().trim() : "";

  // Fail-closed: require explicit recognized environment identity
  if (!environment || !ALLOWED_ENVIRONMENTS.includes(environment)) {
    return {
      ok: false,
      environment: environment || "missing",
      code: "ENV_ISOLATION_VIOLATION",
      reason: "MISSING_OR_INVALID_ENVIRONMENT_IDENTITY",
      httpStatus: 503,
      message:
        `ENV_ISOLATION_VIOLATION: Explicit ENVIRONMENT ('development' | 'staging' | 'production') is required. Received '${rawEnv ?? "undefined"}'.`
    };
  }

  const sbUrl = normalizeSupabaseUrl(env?.SUPABASE_URL || "");
  const urlProjectRef = extractSupabaseProjectRef(sbUrl);
  const declaredProjectRef = String(env?.SUPABASE_PROJECT_REF || "").toLowerCase().trim() || null;

  const srPayload = decodeJwtPayload(env?.SUPABASE_SERVICE_ROLE_KEY || "");
  const anonPayload = decodeJwtPayload(env?.SUPABASE_ANON_KEY || "");
  const srRef = typeof srPayload?.ref === "string" ? srPayload.ref.toLowerCase().trim() : null;
  const anonRef = typeof anonPayload?.ref === "string" ? anonPayload.ref.toLowerCase().trim() : null;

  const resolvedProjectRef = urlProjectRef || declaredProjectRef || srRef || anonRef || null;

  // Staging & Production must always have SUPABASE_URL configured (fail-closed)
  if ((environment === "staging" || environment === "production") && !sbUrl) {
    return {
      ok: false,
      environment,
      code: "ENV_ISOLATION_VIOLATION",
      reason: "MISSING_SUPABASE_URL",
      httpStatus: 503,
      message: `ENV_ISOLATION_VIOLATION: SUPABASE_URL is missing in '${environment}' runtime.`
    };
  }

  // Non-production (staging / development) MUST NEVER touch Production Project Ref
  if (environment !== "production") {
    if (srRef === PRODUCTION_SUPABASE_PROJECT_REF || anonRef === PRODUCTION_SUPABASE_PROJECT_REF) {
      return {
        ok: false,
        environment,
        code: "PRODUCTION_KEY_IN_STAGING_BLOCKED",
        reason: "PRODUCTION_SUPABASE_JWT_KEY_IN_NON_PROD",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Production Supabase key (ref=${PRODUCTION_SUPABASE_PROJECT_REF}) detected inside '${environment}' Worker. Execution blocked.`
      };
    }

    if (
      sbUrl.includes(PRODUCTION_SUPABASE_PROJECT_REF) ||
      sbUrl.toLowerCase().includes("wandermatch-v3") ||
      urlProjectRef === PRODUCTION_SUPABASE_PROJECT_REF ||
      declaredProjectRef === PRODUCTION_SUPABASE_PROJECT_REF
    ) {
      return {
        ok: false,
        environment,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "NON_PROD_CONNECTING_TO_PRODUCTION_SUPABASE",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Worker environment '${environment}' attempted to connect to Production Supabase (${PRODUCTION_SUPABASE_PROJECT_REF}). Connection blocked.`
      };
    }
  }

  // Staging must strictly resolve to STAGING_SUPABASE_PROJECT_REF (no silent fallback)
  if (environment === "staging") {
    if (urlProjectRef !== STAGING_SUPABASE_PROJECT_REF) {
      return {
        ok: false,
        environment,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "STAGING_SUPABASE_URL_MISMATCH",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Staging SUPABASE_URL must resolve to '${STAGING_SUPABASE_PROJECT_REF}', got '${urlProjectRef || "none"}'.`
      };
    }
    if (declaredProjectRef && declaredProjectRef !== STAGING_SUPABASE_PROJECT_REF) {
      return {
        ok: false,
        environment,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "STAGING_PROJECT_REF_MISMATCH",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Staging SUPABASE_PROJECT_REF mismatch ('${declaredProjectRef}' !== '${STAGING_SUPABASE_PROJECT_REF}').`
      };
    }
    if (srRef && srRef !== STAGING_SUPABASE_PROJECT_REF) {
      return {
        ok: false,
        environment,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "STAGING_SERVICE_ROLE_REF_MISMATCH",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Staging SUPABASE_SERVICE_ROLE_KEY ref ('${srRef}') does not match Staging project '${STAGING_SUPABASE_PROJECT_REF}'.`
      };
    }
    if (anonRef && anonRef !== STAGING_SUPABASE_PROJECT_REF) {
      return {
        ok: false,
        environment,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "STAGING_ANON_KEY_REF_MISMATCH",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Staging SUPABASE_ANON_KEY ref ('${anonRef}') does not match Staging project '${STAGING_SUPABASE_PROJECT_REF}'.`
      };
    }
  }

  // Production must never accidentally connect to Staging
  if (environment === "production") {
    if (
      sbUrl.includes(STAGING_SUPABASE_PROJECT_REF) ||
      sbUrl.toLowerCase().includes("wandermatch-v4-staging") ||
      urlProjectRef === STAGING_SUPABASE_PROJECT_REF ||
      declaredProjectRef === STAGING_SUPABASE_PROJECT_REF ||
      srRef === STAGING_SUPABASE_PROJECT_REF ||
      anonRef === STAGING_SUPABASE_PROJECT_REF
    ) {
      return {
        ok: false,
        environment,
        code: "ENV_ISOLATION_VIOLATION",
        reason: "PRODUCTION_CONNECTING_TO_STAGING_SUPABASE",
        httpStatus: 503,
        message:
          `ENV_ISOLATION_VIOLATION: Production Worker attempted to use Staging Supabase (${STAGING_SUPABASE_PROJECT_REF}). Connection blocked.`
      };
    }
  }

  return {
    ok: true,
    environment,
    supabaseUrl: sbUrl,
    projectRef: resolvedProjectRef,
    isIsolated: true
  };
}

export function enforceEnvironmentIsolation(env = {}, contextMeta = {}) {
  const result = validateRuntimeEnvironment(env);
  if (!result.ok) {
    const logger = createStructuredLogger({
      requestId: contextMeta.requestId || "env_guard",
      environment: result.environment
    });
    console.error(
      logger.error("SECURITY_EVENT_ENV_ISOLATION_VIOLATION", {
        code: result.code,
        reason: result.reason,
        operation: contextMeta.operation || "startup_check",
        path: contextMeta.path || null
      })
    );
    const err = new Error(result.message);
    err.code = result.code;
    err.reason = result.reason;
    err.httpStatus = result.httpStatus || 503;
    throw err;
  }

  return {
    environment: result.environment,
    supabaseUrl: result.supabaseUrl,
    projectRef: result.projectRef,
    isIsolated: true
  };
}
