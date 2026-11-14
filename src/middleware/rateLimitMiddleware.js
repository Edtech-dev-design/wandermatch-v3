// ============================================================================
// WANDERMATCH V4.1 — SLIDING-WINDOW RATE LIMIT MIDDLEWARE
// ============================================================================

const RATE_BUCKETS = new Map();

export function checkRateLimit(request, { windowMs = 60000, maxRequests = 300 } = {}) {
  const clientIp =
    request?.headers?.get?.("cf-connecting-ip") ||
    request?.headers?.get?.("x-forwarded-for") ||
    "local-client";
  const now = Date.now();
  const key = `${clientIp}`;
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

