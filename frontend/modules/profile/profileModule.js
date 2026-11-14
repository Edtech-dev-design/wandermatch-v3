// ============================================================================
// WANDERMATCH V4.1 — FRONTEND USER PROFILE & MASKED PII MODULE
// ============================================================================

export function createProfileModule({ apiClient }) {
  return {
    async getMyMaskedPii() {
      return apiClient.get("/api/v4/pii/masked", { requireAuth: true });
    },
    async submitTripFeedback({ bookingCode, rating, review }) {
      return apiClient.post("/api/feedback", { bookingCode, rating, review }, { requireAuth: true });
    }
  };
}

