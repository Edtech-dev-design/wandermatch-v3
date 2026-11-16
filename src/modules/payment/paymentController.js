// ============================================================================
// WANDERMATCH V4.2 — BACKEND PAYMENT & REFUND DOMAIN CONTROLLER
// ============================================================================

import { requireAuthenticatedUser, requireAdminRole } from "../../middleware/authMiddleware.js";
import { invokePostgresRpc } from "../../services/supabase/postgresRpcClient.js";
import { deterministicUuidV4 } from "../../services/v4RelationalEngine.js";

export async function handlePaymentWebhookV4({ body, env, v4db }) {
  const externalTxId = String(body.externalTransactionId || body.external_transaction_id || body.transactionId || body.id || "").trim();
  const providerEventId = String(body.providerEventId || body.provider_event_id || externalTxId || "").trim();
  const transferAmount = Number(body.transferAmount ?? body.transfer_amount ?? body.amount ?? 0);
  const bookingCode = String(body.bookingCode || body.booking_code || "").trim().toUpperCase();
  const transferContent = String(body.content || body.transferContent || body.transfer_content || "").trim();

  if (!externalTxId) {
    const err = new Error("MISSING_TRANSACTION_ID: externalTransactionId or id is required.");
    err.code = "MISSING_TRANSACTION_ID";
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
    const err = new Error("INVALID_AMOUNT: transferAmount must be a positive number.");
    err.code = "INVALID_AMOUNT";
    err.statusCode = 400;
    throw err;
  }
  if (!bookingCode && !transferContent) {
    const err = new Error("MISSING_BOOKING_REFERENCE: bookingCode or transferContent is required.");
    err.code = "MISSING_BOOKING_REFERENCE";
    err.statusCode = 400;
    throw err;
  }

  return invokePostgresRpc(env, v4db, {
    rpcName: "process_payment_webhook_v4",
    role: "service_role",
    uid: null,
    args: {
      p_provider: body.provider || "SEPAY",
      p_provider_event_id: providerEventId,
      p_external_tx_id: externalTxId,
      p_booking_code: bookingCode,
      p_transfer_amount: transferAmount,
      p_transfer_content: transferContent,
      p_bank_code: body.gateway || body.bankCode || body.bank_code || "MB",
      p_raw_payload: body
    }
  });
}

export async function handleRequestRefundV4({ authUser, bearerToken, body, env, v4db }) {
  const user = requireAuthenticatedUser(authUser);
  const resolvedUid = deterministicUuidV4(user.userId || user.email);
  const bookingCode = String(body.bookingCode || body.p_booking_code || "").trim().toUpperCase();
  if (!bookingCode) {
    const err = new Error("bookingCode is required.");
    err.code = "VALIDATION_ERROR";
    err.statusCode = 400;
    throw err;
  }
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "request_refund_v4",
    role: "authenticated",
    uid: resolvedUid,
    bearerToken,
    args: {
      p_booking_code: bookingCode,
      p_mode: body.mode || body.p_mode || "REQUEST",
      p_tier: body.tier || body.p_tier || "EARLY_72H",
      p_reason: body.reason || body.p_reason || null,
      p_evidence_url: body.evidenceUrl || body.p_evidence_url || null,
      p_idempotency_key: body.idempotencyKey || body.p_idempotency_key || null
    }
  });
  return { success: true, ...data };
}

export async function handleFinalizeRefundV4({ authUser, body, env, v4db }) {
  requireAdminRole(authUser);
  const refundId = body.refundId || body.p_refund_id;
  if (!refundId) {
    const err = new Error("refundId is required.");
    err.statusCode = 400;
    throw err;
  }

  try {
    await invokePostgresRpc(env, v4db, {
      rpcName: "claim_refund_for_processing_v4",
      role: "service_role",
      uid: null,
      args: { p_refund_id: refundId }
    });
  } catch {
    // Refund may already be in PROCESSING status; proceed to finalization
  }

  const outcome = body.outcome || body.p_outcome || "SUCCEEDED";
  const bankRef = body.payoutBankRef || body.p_payout_bank_ref || `NAPAS-${String(refundId).slice(0, 8).toUpperCase()}`;
  const data = await invokePostgresRpc(env, v4db, {
    rpcName: "finalize_refund_payout_v4",
    role: "service_role",
    uid: null,
    args: {
      p_refund_id: refundId,
      p_outcome: outcome,
      p_payout_bank_ref: bankRef,
      p_error_message: body.errorMessage || body.p_error_message || null
    }
  });
  return { success: true, ...data };
}
