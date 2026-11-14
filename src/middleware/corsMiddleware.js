// ============================================================================
// WANDERMATCH V4.1 — STRICT PER-ENVIRONMENT CORS MIDDLEWARE
// ============================================================================

export function resolveCorsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOriginSetting = (env && env.ALLOWED_ORIGIN) ? String(env.ALLOWED_ORIGIN).trim() : "*";

  let isAllowed = false;
  let allowOriginHeader = "*";

  if (!allowedOriginSetting || allowedOriginSetting === "*") {
    isAllowed = true;
    allowOriginHeader = requestOrigin || "*";
  } else {
    const allowedList = allowedOriginSetting.split(",").map(o => o.trim().toLowerCase()).filter(Boolean);
    const reqLower = requestOrigin.toLowerCase();
    const matchesWildcard = allowedList.some(pattern => {
      if (!pattern.includes("*")) return pattern === reqLower;
      const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[a-z0-9-]+");
      return new RegExp(`^${escaped}$`, "i").test(reqLower);
    });
    if (!requestOrigin) {
      isAllowed = true;
      allowOriginHeader = allowedList[0] || "*";
    } else if (matchesWildcard) {
      isAllowed = true;
      allowOriginHeader = requestOrigin;
    } else {
      isAllowed = false;
      allowOriginHeader = null;
    }
  }

  const corsHeaders = {
    ...(allowOriginHeader ? { "Access-Control-Allow-Origin": allowOriginHeader } : {}),
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-Id, x-webhook-secret, x-sepay-signature, x-signature, apikey",
    "Access-Control-Expose-Headers": "X-Request-Id, X-Environment",
    "Vary": "Origin"
  };

  return { isAllowed, corsHeaders, requestOrigin };
}

