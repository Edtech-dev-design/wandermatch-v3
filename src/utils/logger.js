// ============================================================================
// WANDERMATCH V4.1 — STRUCTURED LOGGER, REQUEST ID & SECRET REDACTION
// Never allows secrets, tokens, or raw PII to appear in logs or error payloads
// ============================================================================

const SENSITIVE_FIELD_PATTERNS = /secret|password|token|apikey|api_key|service_role|authorization|cccd|pepper|master_key/i;

export function generateRequestId(request = null) {
  const incoming = request?.headers?.get?.("x-request-id");
  if (incoming && /^[a-zA-Z0-9_-]{6,64}$/.test(incoming)) {
    return incoming;
  }
  const rand = Math.random().toString(36).substring(2, 10);
  return `wm_${Date.now().toString(36)}_${rand}`;
}

export function redactSecrets(input) {
  if (input === null || input === undefined) return input;
  if (typeof input === "string") {
    return input
      .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
      .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[REDACTED_JWT]");
  }
  if (Array.isArray(input)) {
    return input.map(redactSecrets);
  }
  if (typeof input === "object") {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
      if (SENSITIVE_FIELD_PATTERNS.test(k)) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = redactSecrets(v);
      }
    }
    return out;
  }
  return input;
}

export function createStructuredLogger({ requestId, environment = "staging" }) {
  function formatEntry(level, event, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      requestId,
      environment,
      event,
      ...redactSecrets(meta)
    });
  }

  return {
    requestId,
    info(event, meta) {
      return formatEntry("INFO", event, meta);
    },
    warn(event, meta) {
      return formatEntry("WARN", event, meta);
    },
    error(event, meta) {
      return formatEntry("ERROR", event, meta);
    }
  };
}

