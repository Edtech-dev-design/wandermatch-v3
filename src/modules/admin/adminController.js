// ============================================================================
// WANDERMATCH V4.2 — BACKEND ADMIN & RECONCILIATION DOMAIN CONTROLLER
// ============================================================================

import { requireAdminRole } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleApproveRefundV4({ authUser, bearerToken, body, env, v4db }) {
  const admin = requireAdminRole(authUser);
  const adminUid = deterministicUuidV4(admin.userId || admin.email);
  const decision = body.decision || body.p_decision || "APPROVE";
  const refundId = body.refundId || body.p_refund_id;

  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "approve_refund_v4",
    role: "authenticated",
    uid: adminUid,
    bearerToken,
    args: {
      p_refund_id: refundId,
      p_decision: decision,
      p_review_note: body.reviewNote || body.p_review_note || null
    }
  });

  if (
    decision === "APPROVE" &&
    (body.autoSettleSandbox === true || body.auto_settle_sandbox === true) &&
    refundId
  ) {
    await invokePostgresRpc(env, v4db, {
      rpcName: "claim_refund_for_processing_v4",
      role: "service_role",
      uid: null,
      args: { p_refund_id: refundId }
    });
    const finalized = await invokePostgresRpc(env, v4db, {
      rpcName: "finalize_refund_payout_v4",
      role: "service_role",
      uid: null,
      args: {
        p_refund_id: refundId,
        p_outcome: "SUCCEEDED",
        p_payout_bank_ref: body.payoutBankRef || `SANDBOX-${String(refundId).slice(0, 8).toUpperCase()}`
      }
    });
    return { success: true, ...data, payout: finalized };
  }

  return { success: true, ...data };
}

export async function handleRunReconciliationV4({ authUser, env, v4db }) {
  requireAdminRole(authUser);
  const checks = await invokePostgresRpc(env, v4db, {
    rpcName: "run_v4_reconciliation_checks",
    role: "service_role",
    uid: null,
    args: {}
  });
  return { success: true, checks };
}

export async function handleReconcileSettlementV4({ authUser, body, env, v4db }) {
  requireAdminRole(authUser);
  const settlement = await invokePostgresRpc(env, v4db, {
    rpcName: "reconcile_external_settlement_v4",
    role: "service_role",
    uid: null,
    args: { p_settlement_records: body.records || body.p_settlement_records || [] }
  });
  return { success: true, settlement };
}

export async function handleCutoverWriteFreezeV4({ authUser, body, env, v4db }) {
  requireAdminRole(authUser);
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "set_cutover_write_freeze_v4",
    role: "service_role",
    uid: null,
    args: {
      p_write_freeze: Boolean(body.writeFreeze ?? body.p_write_freeze ?? false),
      p_maintenance_readonly: Boolean(body.maintenanceReadonly ?? body.p_maintenance_readonly ?? false)
    }
  });
  return { success: true, ...data };
}

export async function handleReplayQueuedWebhooksV4({ authUser, body, env, v4db }) {
  requireAdminRole(authUser);
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "replay_queued_webhook_events_v4",
    role: "service_role",
    uid: null,
    args: { p_batch_limit: Number(body.batchLimit || body.p_batch_limit || 200) }
  });
  return { success: true, replay: data };
}

export async function handleRollbackRehearsalV4({ authUser, env, v4db }) {
  requireAdminRole(authUser);
  const delta = await invokePostgresRpc(env, v4db, {
    rpcName: "export_v4_delta_for_v3_rollback",
    role: "service_role",
    uid: null,
    args: {}
  });
  return { success: true, rollback_delta: delta };
}
