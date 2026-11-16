// ============================================================================
// WANDERMATCH V4.1 — SLIDING-WINDOW RATE LIMIT MIDDLEWARE
// ============================================================================

const RATE_BUCKETS = new Map();

export function checkRateLimit(request, optionsOrEnv = {}, maybeOptions = {}) {
  const isEnvArg =
    optionsOrEnv &&
    ("ENVIRONMENT" in optionsOrEnv || "SUPABASE_URL" in optionsOrEnv || "USE_V4_POSTGRES_RPC" in optionsOrEnv);
  const env = isEnvArg ? optionsOrEnv : (optionsOrEnv?.env || null);
  const { windowMs = 60000, maxRequests = 300 } = isEnvArg ? (maybeOptions || {}) : (optionsOrEnv || {});

  const clientIp =
    request?.headers?.get?.("cf-connecting-ip") ||
    request?.headers?.get?.("x-forwarded-for") ||
    "local-client";
  const allowBenchDiscriminator =
    Boolean(env) && String(env?.ENVIRONMENT || "").toLowerCase() !== "production";
  const rawBenchId = allowBenchDiscriminator
    ? String(request?.headers?.get?.("x-benchmark-client-id") || "").trim()
    : "";
  const safeBenchId = rawBenchId.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64);

  const now = Date.now();
  const key = safeBenchId ? `${clientIp}:${safeBenchId}` : `${clientIp}`;
  let entry = RATE_BUCKETS.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    if (RATE_BUCKETS.size > 2000) RATE_BUCKETS.clear();
    RATE_BUCKETS.set(key, entry);
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);
  return {
    allowed: entry.count <= maxRequests,
    limit: maxRequests,
    remaining,
    resetAt: entry.resetAt
  };
}

