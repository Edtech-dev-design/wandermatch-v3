// ============================================================================
// WANDERMATCH V4.1 — FRONTEND AUTH MODULE
// Handles Registration, Login, Session Validation & Social OAuth via Worker API
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function createAuthModule({ apiClient, storage = globalThis.localStorage }) {
  const SESSION_KEY = "wm_supabase_session";

  function saveSessionFromResponse(res) {
    if (res?.token && storage?.setItem) {
      storage.setItem(SESSION_KEY, JSON.stringify({ access_token: res.token, user: res.user }));
    }
  }

  function getSavedSession() {
    try {
      const raw = storage?.getItem?.(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function assertValidEmail(email) {
    const clean = String(email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      const err = new Error("Email không hợp lệ.");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }
    return clean;
  }

  return {
    async register({ email, password, name }) {
      const cleanEmail = assertValidEmail(email);
      if (!password || String(password).length < 6) {
        const err = new Error("Mật khẩu tối thiểu 6 ký tự.");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        throw err;
      }
      const res = await apiClient.post("/api/v4/auth/register", {
        email: cleanEmail,
        password,
        name: String(name || cleanEmail.split("@")[0]).trim()
      });
      saveSessionFromResponse(res);
      return res;
    },
    async login({ email, password }) {
      const cleanEmail = assertValidEmail(email);
      if (!password) {
        const err = new Error("Vui lòng nhập mật khẩu.");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        throw err;
      }
      const res = await apiClient.post("/api/v4/auth/login", { email: cleanEmail, password });
      saveSessionFromResponse(res);
      return res;
    },
    async verifySession() {
      return apiClient.get("/api/v4/auth/me", { requireAuth: true });
    },
    async forgotPassword({ email }) {
      const cleanEmail = assertValidEmail(email);
      return apiClient.post("/api/v4/auth/forgot-password", { email: cleanEmail });
    },
    async resetPassword({ email = "", otp = "", recoveryToken = "", newPassword }) {
      if (!newPassword || String(newPassword).length < 6) {
        const err = new Error("Mật khẩu mới tối thiểu 6 ký tự.");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        throw err;
      }
      return apiClient.post("/api/v4/auth/reset-password", {
        email: email ? assertValidEmail(email) : "",
        otp: String(otp || "").trim(),
        recoveryToken: String(recoveryToken || "").trim(),
        newPassword
      });
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

