// ============================================================================
// WANDERMATCH V4.1 — FRONTEND ADMIN & RECONCILIATION MODULE
// ============================================================================

export function createAdminModule({ apiClient }) {
  return {
    async getSystemHealth() {
      return apiClient.checkHealth();
    },
    async getAdminSummary() {
      return apiClient.get("/api/admin-summary", { requireAuth: true });
    },
    async runReconciliationChecks() {
      return apiClient.get("/api/v4/reconciliation", { requireAuth: true });
    },
    runReconciliationCheck() {
      return this.runReconciliationChecks();
    },
    async approveRefund({ refundId, decision = "APPROVE", reviewNote = null, autoSettleSandbox = false }) {
      return apiClient.post(
        "/api/v4/refunds/approve",
        { refundId, decision, reviewNote, autoSettleSandbox },
        { requireAuth: true }
      );
    },
    async reconcileSettlement(records = []) {
      return apiClient.post("/api/v4/reconciliation/settlement", { records }, { requireAuth: true });
    }
  };
}

