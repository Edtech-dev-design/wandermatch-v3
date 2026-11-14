// ============================================================================
// WANDERMATCH V4.1 — FRONTEND AUTH MODULE
// Handles Registration, Login, Session Validation & Social OAuth via Worker API
// ============================================================================

export function createAuthModule({ apiClient, storage = globalThis.localStorage }) {
  const SESSION_KEY = "wm_supabase_session";

  function getSavedSession() {
    try {
      const raw = storage?.getItem?.(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  return {
    async register({ email, password, name }) {
      const res = await apiClient.post("/api/auth/register", { email, password, name });
      if (res.token && storage?.setItem) {
        storage.setItem(SESSION_KEY, JSON.stringify({ access_token: res.token, user: res.user }));
      }
      return res;
    },
    async login({ email, password }) {
      const res = await apiClient.post("/api/auth/login", { email, password });
      if (res.token && storage?.setItem) {
        storage.setItem(SESSION_KEY, JSON.stringify({ access_token: res.token, user: res.user }));
      }
      return res;
    },
    async verifySession() {
      return apiClient.get("/api/auth/me", { requireAuth: true });
    },
    logout() {
      try {
        storage?.removeItem?.(SESSION_KEY);
      } catch (_) {}
      return { success: true };
    },
    getSavedSession
  };
}

