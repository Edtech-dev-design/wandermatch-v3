// ============================================================================
// WANDERMATCH V4.2 — BACKEND ADMIN & RECONCILIATION DOMAIN CONTROLLER
// ============================================================================

import { requireAdminRole } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc, selectPostgresRows } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handleApproveRefundV4({ authUser, bearerToken, body, env, v4db }) {
  const admin = requireAdminRole(authUser);
  const decision = String(body?.decision || body?.p_decision || "APPROVE").trim().toUpperCase();
  const refundId = String(body?.refundId || body?.p_refund_id || "").trim();
  if (!refundId) {
    const err = new Error("refundId is required.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }
  if (!["APPROVE", "REJECT"].includes(decision)) {
    const err = new Error("decision must be APPROVE or REJECT.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }
  const adminUid = deterministicUuidV4(admin.userId || admin.email);
  await invokePostgresRpc(env, v4db, {
    rpcName: "ensure_user_profile_v4",
    role: "service_role",
    uid: null,
    args: {
      p_user_id: adminUid,
      p_email: admin.email || "admin@wandermatch.vn",
      p_full_name: admin.name || "System Admin",
      p_role: "admin"
    }
  }).catch(() => {});

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

function summarizeAdminCollections(bookings, payments, refunds, reviews, auditLogs, source) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeRefunds = Array.isArray(refunds) ? refunds : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const safeAudits = Array.isArray(auditLogs) ? auditLogs : [];

  const paidBookings = safeBookings.filter(b => ["PAID", "OVERPAID", "REVEALED", "COMPLETED"].includes(b.status));
  const revealedBookings = safeBookings.filter(b => b.is_revealed || ["REVEALED", "COMPLETED"].includes(b.status));
  const pendingRefunds = safeRefunds.filter(r => ["REQUESTED", "APPROVED", "PROCESSING"].includes(r.status));
  const totalExpectedVnd = safeBookings.reduce((sum, b) => sum + Number(b.expected_amount_vnd || 0), 0);
  const totalPaidVnd = safePayments.reduce((sum, p) => sum + Number(p.paid_amount_vnd || 0), 0);
  const totalRefundedVnd = safePayments.reduce((sum, p) => sum + Number(p.refunded_amount_vnd || 0), 0);

  return {
    success: true,
    source,
    summary: {
      totalBookings: safeBookings.length,
      paidBookings: paidBookings.length,
      revealedBookings: revealedBookings.length,
      totalExpectedVnd,
      totalPaidVnd,
      totalRefundedVnd,
      totalRefunds: safeRefunds.length,
      pendingRefunds: pendingRefunds.length,
      totalReviews: safeReviews.length
    },
    recentBookings: safeBookings.slice(0, 20).map(b => ({
      id: b.id,
      booking_code: b.booking_code,
      status: b.status,
      expected_amount_vnd: Number(b.expected_amount_vnd || 0),
      paid_amount_vnd: Number(b.paid_amount_vnd || 0),
      is_revealed: Boolean(b.is_revealed),
      departure_date: b.departure_date || null,
      created_at: b.created_at || null
    })),
    recentRefunds: safeRefunds.slice(0, 20),
    recentAuditLogs: safeAudits.slice(0, 20)
  };
}

export async function handleGetAdminSummaryV4({ authUser, env, v4db }) {
  requireAdminRole(authUser);
  const isPostgresRpc = Boolean(
    env &&
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    String(env.USE_V4_POSTGRES_RPC).toLowerCase() === "true"
  );

  if (isPostgresRpc) {
    const [bookings, payments, refunds, reviews, auditLogs] = await Promise.all([
      selectPostgresRows(env, {
        table: "bookings",
        query: "select=id,booking_code,status,expected_amount_vnd,paid_amount_vnd,is_revealed,departure_date,created_at&order=created_at.desc&limit=50"
      }).catch(() => []),
      selectPostgresRows(env, {
        table: "payments",
        query: "select=id,booking_id,expected_amount_vnd,paid_amount_vnd,refunded_amount_vnd,payment_status,created_at&order=created_at.desc&limit=50"
      }).catch(() => []),
      selectPostgresRows(env, {
        table: "refunds",
        query: "select=id,booking_id,tier_applied,refund_amount_vnd,cancellation_fee_vnd,status,requested_at&order=requested_at.desc&limit=50"
      }).catch(() => []),
      selectPostgresRows(env, {
        table: "reviews",
        query: "select=id,booking_id,rating,ai_match_rating,moderation_status,created_at&order=created_at.desc&limit=50"
      }).catch(() => []),
      selectPostgresRows(env, {
        table: "audit_logs",
        query: "select=id,actor_role,action_type,target_table,target_id,created_at&order=created_at.desc&limit=20"
      }).catch(() => [])
    ]);
    return summarizeAdminCollections(bookings, payments, refunds, reviews, auditLogs, "supabase_postgres");
  }

  const t = v4db?.tables || {};
  return summarizeAdminCollections(
    [...(t.bookings || [])].reverse(),
    [...(t.payments || [])].reverse(),
    [...(t.refunds || [])].reverse(),
    [...(t.reviews || [])].reverse(),
    [...(t.audit_logs || [])].reverse(),
    "relational_memory"
  );
}
