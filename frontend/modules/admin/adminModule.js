// ============================================================================
// WANDERMATCH V4.1 — FRONTEND ADMIN & RECONCILIATION MODULE
// ============================================================================

export function createAdminModule({ apiClient }) {
  return {
    async getAdminSummary() {
      return apiClient.get("/api/admin-summary", { requireAuth: true });
    },
    async runReconciliationChecks() {
      return apiClient.get("/api/v4/reconciliation", { requireAuth: true });
    },
    async approveRefund({ refundId, decision = "APPROVE", reviewNote = null }) {
      return apiClient.post("/api/v4/refunds/approve", { refundId, decision, reviewNote }, { requireAuth: true });
    },
    async reconcileSettlement(records = []) {
      return apiClient.post("/api/v4/reconciliation/settlement", { records }, { requireAuth: true });
    }
  };
}

