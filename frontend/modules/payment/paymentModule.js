// ============================================================================
// WANDERMATCH V4.1 — FRONTEND PAYMENT & REFUND MODULE
// Client never confirms payments directly; only checks status or requests refund
// ============================================================================

export function createPaymentModule({ apiClient }) {
  return {
    async checkPaymentStatus(bookingCode) {
      const code = String(bookingCode || "").trim().toUpperCase();
      if (!code) throw new Error("bookingCode is required.");
      const res = await apiClient.get(`/api/v4/bookings/status?bookingCode=${encodeURIComponent(code)}`, {
        requireAuth: true
      });
      const bk = res.booking || res;
      const status = String(bk.status || "PENDING_PAYMENT").toUpperCase();
      const paidAmount = Number(bk.paid_amount_vnd ?? bk.paidAmount ?? 0);
      const expectedAmount = Number(bk.expected_amount_vnd ?? bk.expectedAmount ?? 0);
      const amountDue = Number(bk.amount_due_vnd ?? bk.amountDue ?? Math.max(0, expectedAmount - paidAmount));
      return {
        ...res,
        booking: bk,
        status,
        isPaid: ["PAID", "OVERPAID", "REVEALED", "COMPLETED"].includes(status),
        paidAmount,
        expectedAmount,
        amountDue
      };
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

