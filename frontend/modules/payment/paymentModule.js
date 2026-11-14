// ============================================================================
// WANDERMATCH V4.1 — FRONTEND PAYMENT & REFUND MODULE
// Client never confirms payments directly; only checks status or requests refund
// ============================================================================

export function createPaymentModule({ apiClient }) {
  return {
    async checkPaymentStatus(bookingCode) {
      if (!bookingCode) throw new Error("bookingCode is required.");
      return apiClient.get(`/api/payment/check-status?bookingCode=${encodeURIComponent(bookingCode)}`, {
        requireAuth: true
      });
    },
    async requestRefund({ bookingCode, mode = "REQUEST", tier = "EARLY_72H", reason = null, evidenceUrl = null, idempotencyKey = null }) {
      if (!bookingCode) throw new Error("bookingCode is required for refund request.");
      return apiClient.post(
        "/api/v4/refunds/request",
        { bookingCode, mode, tier, reason, evidenceUrl, idempotencyKey },
        { requireAuth: true }
      );
    }
  };
}

