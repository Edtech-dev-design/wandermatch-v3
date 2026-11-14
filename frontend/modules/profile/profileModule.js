// ============================================================================
// WANDERMATCH V4.1 — FRONTEND USER PROFILE & MASKED PII MODULE
// ============================================================================

export function createProfileModule({ apiClient }) {
  return {
    async getProfile() {
      return apiClient.get("/api/v4/users/profile", { requireAuth: true });
    },
    async updateProfile(payload = {}) {
      if (payload.fullName !== undefined && String(payload.fullName).trim().length < 2) {
        const err = new Error("Họ và tên phải có ít nhất 2 ký tự.");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        throw err;
      }
      return apiClient.put("/api/v4/users/profile", payload, { requireAuth: true });
    },
    async getMyMaskedPii() {
      return apiClient.get("/api/v4/pii/masked", { requireAuth: true });
    },
    async upsertSensitivePii({ cccd, refundBankCode, refundBankAccount, refundBankHolder }) {
      if (!cccd || !refundBankCode || !refundBankAccount || !refundBankHolder) {
        const err = new Error("Vui lòng điền đầy đủ CCCD và thông tin ngân hàng hoàn tiền.");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        throw err;
      }
      return apiClient.post(
        "/api/v4/pii/upsert",
        { cccd, refundBankCode, refundBankAccount, refundBankHolder },
        { requireAuth: true }
      );
    },
    async submitTripFeedback({ bookingCode, rating, aiMatchRating, review, reviewText }) {
      return apiClient.post(
        "/api/v4/reviews",
        {
          bookingCode,
          rating: Number(rating || 5),
          aiMatchRating: Number(aiMatchRating || rating || 5),
          reviewText: String(reviewText || review || "").trim()
        },
        { requireAuth: true }
      );
    }
  };
}

