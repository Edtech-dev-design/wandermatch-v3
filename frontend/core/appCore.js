// ============================================================================
// WANDERMATCH V4.1 — FRONTEND CORE APPLICATION INITIALIZER
// ============================================================================

import {
  resolveFrontendEnvironment,
  assertStagingNotConnectedToProduction
} from "../config/environments.js";

export function generateClientRequestId() {
  const rand = Math.random().toString(36).substring(2, 10);
  return `req_${Date.now().toString(36)}_${rand}`;
}

export function createFrontendCore(customWindow = typeof window !== "undefined" ? window : null) {
  const host = customWindow?.location?.hostname || "localhost";
  const port = customWindow?.location?.port || "";
  const envConfig = resolveFrontendEnvironment(host, port);

  // Enforce strict isolation before any network activity
  assertStagingNotConnectedToProduction(envConfig);

  const listeners = new Map();

  return {
    version: "4.1.0",
    env: envConfig,
    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);
      return () => listeners.get(event)?.delete(handler);
    },
    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) return;
      for (const fn of set) {
        try { fn(payload); } catch (_) {}
      }
    }
  };
}

