import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { V4RelationalDatabase } from "../src/services/v4RelationalEngine.js";
import {
  decryptPiiValue
} from "../src/security/piiCrypto.js";
import {
  runFiveStageRecommendationPipeline
} from "../src/engines/recommendationEngine.js";

const TEST_ENV = {
  SESSION_SECRET: "v4-enterprise-jwt-secret-key-2026",
  PAYMENT_WEBHOOK_SECRET: "v4-enterprise-webhook-hmac-secret",
  PII_MASTER_KEYS_JSON: JSON.stringify({
    v1: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    v2: "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    1: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    2: "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210"
  }),
  PII_ACTIVE_KEY_VERSION: "1",
  PII_BLIND_INDEX_PEPPER: "wandermatch-v4-blind-index-pepper-2026"
};

function setupUsers(db) {
  db.resetCluster();
  const userA = "11111111-1111-4111-8111-111111111111";
  const userB = "22222222-2222-4222-8222-222222222222";
  const adminId = "00000000-0000-4000-8000-000000000002"; // seeded super_admin & admin

  db.tables.profiles.push(
    {
      id: userA,
      email: "user.a@wandermatch.vn",
      full_name: "Nguyen Van A",
      phone: "0909111222",
      loyalty_tier: "BRONZE",
      loyalty_points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: userB,
      email: "user.b@wandermatch.vn",
      full_name: "Tran Thi B",
      phone: "0909333444",
      loyalty_tier: "BRONZE",
      loyalty_points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );
  db.tables.user_roles.push(
    { id: crypto.randomUUID(), user_id: userA, role: "traveler", is_active: true, granted_by: null, granted_at: new Date().toISOString() },
    { id: crypto.randomUUID(), user_id: userB, role: "traveler", is_active: true, granted_by: null, granted_at: new Date().toISOString() }
  );

  return { userA, userB, adminId };
}

test("WanderMatch V4.0 — Quantitative Acceptance Test Matrix (T-01 through T-20)", async (t) => {

  await t.test("T-01: RLS Cross-Tenant Isolation & Direct Table Write Denial", async () => {
    const db = new V4RelationalDatabase("t01");
    const { userA, userB } = setupUsers(db);

    const recA = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const bookA = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: recA.packages[0].package_id,
      p_booking_code: "WM20260101"
    });

    // User B queries bookings and payments -> 0 rows visible under RLS
    const bBookings = await db.queryTableAsRole({ role: "authenticated", uid: userB, table: "bookings", action: "SELECT" });
    const bPayments = await db.queryTableAsRole({ role: "authenticated", uid: userB, table: "payments", action: "SELECT" });
    assert.equal(bBookings.length, 0, "User B must see 0 rows in bookings");
    assert.equal(bPayments.length, 0, "User B must see 0 rows in payments");

    // Direct SELECT on revoked service_role-only tables must fail with 42501
    await assert.rejects(
      async () => db.queryTableAsRole({ role: "authenticated", uid: userB, table: "user_sensitive_pii", action: "SELECT" }),
      (err) => err.code === "42501"
    );
    await assert.rejects(
      async () => db.queryTableAsRole({ role: "authenticated", uid: userB, table: "outbox_events", action: "SELECT" }),
      (err) => err.code === "42501"
    );
    await assert.rejects(
      async () => db.queryTableAsRole({ role: "authenticated", uid: userB, table: "payment_webhook_events", action: "SELECT" }),
      (err) => err.code === "42501"
    );

    // User A attempts direct UPDATE on append-only table booking_status_history -> 42501
    await assert.rejects(
      async () => db.queryTableAsRole({ role: "authenticated", uid: userA, table: "booking_status_history", action: "UPDATE", payload: {} }),
      (err) => err.code === "42501"
    );
    assert.ok(bookA.booking_id);
  });

  await t.test("T-02: Blind Reveal Secrecy & Pre-Reveal Leak Prevention", async () => {
    const db = new V4RelationalDatabase("t02");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20260201"
    });

    // Direct SELECT on packages by non-admin returns 0 rows (must use rpcGetMySealedPackages)
    const directPkgs = await db.queryTableAsRole({ role: "authenticated", uid: userA, table: "packages", action: "SELECT" });
    assert.equal(directPkgs.length, 0, "Direct table SELECT on packages must return 0 rows for non-admin");

    // Pre-reveal booking_items SELECT returns 0 rows
    const preRevealItems = await db.queryTableAsRole({ role: "authenticated", uid: userA, table: "booking_items", action: "SELECT" });
    assert.equal(preRevealItems.length, 0, "Pre-reveal booking_items must be hidden by RLS");

    const jsonInspection = JSON.stringify({ rec: rec.packages, book });
    const forbiddenTokens = ["Đà Lạt", "Măng Đen", "Sa Pa", "Phú Quốc", "Quy Nhơn", "Nha Trang", "Cố Đô Huế", "Hội An", "VN1380", "SLA-DLI"];
    for (const token of forbiddenTokens) {
      assert.equal(jsonInspection.includes(token), false, `Pre-reveal payload leaked forbidden token: ${token}`);
    }

    // Attempt reveal while PENDING_PAYMENT -> 402
    await assert.rejects(
      async () => db.rpcRevealBlindBooking(userA, "WM20260201"),
      (err) => err.httpStatus === 402
    );
  });

  await t.test("T-03: Inventory Hold Race Condition (50 Concurrent Requests on 1 Last Slot)", async () => {
    const db = new V4RelationalDatabase("t03");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const topPkg = db.tables.packages.find((p) => p.id === rec.packages[0].package_id);
    const pItems = db.tables.package_items.filter((pi) => pi.package_id === topPkg.id);

    // Constrain inventory slots of topPkg so only 1 booking of groupSize=2 can succeed
    for (const pi of pItems) {
      const inv = db.tables.partner_inventories.find((i) => i.id === pi.inventory_id);
      inv.total_slots = pi.units_required;
      inv.available_slots = pi.units_required;
      inv.reserved_slots = 0;
    }

    const attempts = await Promise.allSettled(
      Array.from({ length: 50 }, (_, idx) => {
        const uid = `10000000-0000-4000-8000-${String(idx + 1).padStart(12, "0")}`;
        db.tables.profiles.push({
          id: uid,
          email: `racer${idx}@wandermatch.vn`,
          full_name: `Racer ${idx}`,
          phone: null,
          loyalty_tier: "BRONZE",
          loyalty_points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        const sessId = crypto.randomUUID();
        const pkgId = crypto.randomUUID();
        db.tables.recommendation_sessions.push({
          ...db.tables.recommendation_sessions[0],
          id: sessId,
          user_id: uid
        });
        db.tables.packages.push({
          ...topPkg,
          id: pkgId,
          session_id: sessId,
          user_id: uid,
          status: "SEALED_ACTIVE"
        });
        for (const pi of pItems) {
          db.tables.package_items.push({
            ...pi,
            id: crypto.randomUUID(),
            package_id: pkgId
          });
        }
        const code = `WM${String(20263000 + idx).padStart(8, "0")}`;
        return db.rpcCreateBookingWithHold(uid, {
          p_package_id: pkgId,
          p_booking_code: code
        });
      })
    );

    const fulfilled = attempts.filter((r) => r.status === "fulfilled");
    const rejected = attempts.filter((r) => r.status === "rejected" && r.reason?.httpStatus === 409);

    assert.equal(fulfilled.length, 1, "Exactly 1 request must succeed");
    assert.equal(rejected.length, 49, "Exactly 49 requests must fail with 409 INSUFFICIENT_INVENTORY");

    for (const pi of pItems) {
      const inv = db.tables.partner_inventories.find((i) => i.id === pi.inventory_id);
      assert.equal(inv.available_slots, 0);
      assert.equal(inv.reserved_slots, inv.total_slots);
    }
  });

  await t.test("T-04: Webhook Replay & Concurrency Storm (50 Parallel Identical Webhooks)", async () => {
    const db = new V4RelationalDatabase("t04");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20260401"
    });

    const results = await Promise.all(
      Array.from({ length: 50 }, () =>
        db.rpcProcessPaymentWebhook({
          p_provider: "SEPAY",
          p_provider_event_id: "EVT-999111",
          p_external_tx_id: "SEP-999111",
          p_booking_code: "WM20260401",
          p_transfer_amount: book.expected_amount_vnd
        })
      )
    );

    const fresh = results.filter((r) => r.idempotent_replay === false);
    const replays = results.filter((r) => r.idempotent_replay === true);
    assert.equal(fresh.length, 1, "Exactly 1 webhook processes fresh payment");
    assert.equal(replays.length, 49, "49 webhooks return idempotent_replay: true");

    const txs = db.tables.payment_transactions.filter((tx) => tx.external_transaction_id === "SEP-999111");
    assert.equal(txs.length, 1, "payment_transactions has exactly 1 row");

    const bkRow = db.tables.bookings.find((b) => b.id === book.booking_id);
    assert.equal(bkRow.paid_amount_vnd, book.expected_amount_vnd);
    assert.equal(bkRow.status, "PAID");
  });

  await t.test("T-05: Split Payment Accumulation (Underpayment -> Exact Completion -> Overpayment)", async () => {
    const db = new V4RelationalDatabase("t05");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20260501"
    });

    const expected = book.expected_amount_vnd;
    const part1 = 3000000;
    const part2 = expected - part1;
    const part3 = 500000;

    const res1 = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-SPLIT-1",
      p_booking_code: "WM20260501",
      p_transfer_amount: part1
    });
    assert.equal(res1.status, "UNDERPAID");
    assert.equal(res1.paid_amount_vnd, part1);
    assert.equal(res1.amount_due_vnd, expected - part1);
    await assert.rejects(async () => db.rpcRevealBlindBooking(userA, "WM20260501"), (e) => e.httpStatus === 402);

    const res2 = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-SPLIT-2",
      p_booking_code: "WM20260501",
      p_transfer_amount: part2
    });
    assert.equal(res2.status, "PAID");
    assert.equal(res2.paid_amount_vnd, expected);
    assert.equal(res2.amount_due_vnd, 0);

    const res3 = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-SPLIT-3",
      p_booking_code: "WM20260501",
      p_transfer_amount: part3
    });
    assert.equal(res3.status, "OVERPAID");
    assert.equal(res3.paid_amount_vnd, expected + part3);
    assert.equal(res3.overpaid_amount_vnd, part3);
  });

  await t.test("T-06: Late Payment After Hold Expiry (`PAID_HOLD_CONFLICT` Safe Handling)", async () => {
    const db = new V4RelationalDatabase("t06");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20260601"
    });

    // Expire the hold
    const bkRow = db.tables.bookings.find((b) => b.id === book.booking_id);
    bkRow.hold_expires_at = new Date(Date.now() - 60000).toISOString();
    await db.rpcExpireStaleHolds();
    assert.equal(bkRow.status, "EXPIRED");

    // Exhaust available slots so re-acquisition fails
    const holds = db.tables.inventory_holds.filter((h) => h.booking_id === book.booking_id);
    for (const h of holds) {
      const inv = db.tables.partner_inventories.find((i) => i.id === h.inventory_id);
      inv.available_slots = 0;
    }

    // Late webhook arrives -> transitions to PAID_HOLD_CONFLICT
    const lateRes = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-LATE-06",
      p_booking_code: "WM20260601",
      p_transfer_amount: book.expected_amount_vnd
    });
    assert.equal(lateRes.status, "PAID_HOLD_CONFLICT");

    // Request refund on PAID_HOLD_CONFLICT -> 0% fee (100% refund)
    const ref = await db.rpcRequestRefund(userA, {
      p_booking_code: "WM20260601",
      p_mode: "REQUEST",
      p_tier: "EARLY_72H"
    });
    assert.equal(ref.refund_amount_vnd, book.expected_amount_vnd);
  });

  await t.test("T-07: Post-Reveal Refund Lockout (`LAST_MINUTE_24H` vs `FORCE_MAJEURE`)", async () => {
    const db = new V4RelationalDatabase("t07");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20260701"
    });

    await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-T07-1",
      p_booking_code: "WM20260701",
      p_transfer_amount: book.expected_amount_vnd
    });
    const revealed = await db.rpcRevealBlindBooking(userA, "WM20260701");
    assert.equal(revealed.status, "REVEALED");
    assert.ok(revealed.destination.city_name);

    // Standard refund quote after reveal -> 100% fee (0 VND refund)
    const quoteStandard = await db.rpcRequestRefund(userA, {
      p_booking_code: "WM20260701",
      p_mode: "QUOTE",
      p_tier: "EARLY_72H"
    });
    assert.equal(quoteStandard.refund_amount_vnd, 0);
    assert.equal(quoteStandard.cancellation_fee_vnd, book.expected_amount_vnd);

    // Force Majeure refund request after reveal -> 90% refund (10% fee)
    const reqForceMajeure = await db.rpcRequestRefund(userA, {
      p_booking_code: "WM20260701",
      p_mode: "REQUEST",
      p_tier: "FORCE_MAJEURE",
      p_reason: "Severe typhoon flight cancellation",
      p_evidence_url: "https://evidence.wandermatch.vn/typhoon.pdf"
    });
    assert.equal(reqForceMajeure.status, "REQUESTED");
    assert.equal(reqForceMajeure.refund_amount_vnd, Math.round(book.expected_amount_vnd * 0.9));
  });

  await t.test("T-08: AI Recommendation Budget Hard-Constraint, Scoring Determinism & k-Anonymity (k >= 3)", async () => {
    const db = new V4RelationalDatabase("t08");
    const { userA } = setupUsers(db);

    const budgetPerPerson = 5500000;
    const groupSize = 2;
    const rec1 = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: budgetPerPerson,
      groupSize,
      departureDate: "2026-11-15",
      userPreferences: { healing: 95, nature: 90, solitude: 85, comfort: 90, culture: 80 }
    });
    const rec2 = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: budgetPerPerson,
      groupSize,
      departureDate: "2026-11-15",
      userPreferences: { healing: 95, nature: 90, solitude: 85, comfort: 90, culture: 80 }
    });

    assert.equal(rec1.packages.length, 3);
    for (let i = 0; i < rec1.packages.length; i++) {
      const p1 = rec1.packages[i];
      const p2 = rec2.packages[i];
      assert.equal(p1.total_score, p2.total_score, "Deterministic score must be identical across runs");
      assert.ok(p1.unit_price_vnd <= budgetPerPerson, "unit_price_vnd must never exceed budgetPerPersonVnd");
      assert.equal(p1.unit_price_vnd % 500000, 0, "unit_price_vnd must be quantized to 500,000 VND flat tiers");
      assert.equal(p1.expected_amount_vnd, p1.unit_price_vnd * groupSize);
      assert.ok(p1.k_anonymity_count >= 3, `k_anonymity_count (${p1.k_anonymity_count}) must be >= 3`);
    }
  });

  await t.test("T-09: Admin Role Escalation Prevention", async () => {
    const db = new V4RelationalDatabase("t09");
    const { userA } = setupUsers(db);

    assert.equal(db.isAdmin(userA), false);
    await assert.rejects(
      async () =>
        db.queryTableAsRole({
          role: "authenticated",
          uid: userA,
          table: "user_roles",
          action: "INSERT",
          payload: { user_id: userA, role: "admin", is_active: true }
        }),
      (err) => err.code === "42501"
    );
  });

  await t.test("T-10: Post-Cutover Zero-Loss Financial Reconciliation (Recon #1 - #7)", async () => {
    const db = new V4RelationalDatabase("t10");
    setupUsers(db);

    const v3Snapshot = {
      bookings: [
        {
          bookingCode: "WM-123456",
          ownerEmail: "legacy@wandermatch.vn",
          customerName: "Legacy User",
          groupSize: 2,
          expectedAmount: 7000000,
          paidAmount: 7000000,
          status: "PAID",
          isRevealed: true,
          revealedAt: "2026-10-30T10:00:00Z"
        }
      ],
      payments: [
        {
          transactionId: "TXN-LEGACY-001",
          bookingCode: "WM-123456",
          amount: 7000000,
          verifiedAt: "2026-10-30T09:55:00Z"
        }
      ],
      refunds: []
    };

    await db.migrateV3StateToV4(v3Snapshot);
    const reconResults = await db.rpcRunReconciliationChecks(v3Snapshot);
    assert.equal(reconResults.recon_1_orphan_bookings, 0);
    assert.equal(reconResults.recon_2_amount_mismatch, 0);
    assert.equal(reconResults.recon_3_orphan_tx, 0);
    assert.equal(reconResults.recon_4_inventory_mismatch, 0);
    assert.equal(reconResults.recon_5_refund_mismatch, 0);
    assert.equal(reconResults.recon_6_unprocessed_webhooks, 0);
    assert.equal(reconResults.recon_7_ownership_mismatch, 0);
    assert.equal(reconResults.total_discrepancy, 0, "All 7 Gatekeeper Reconciliation Queries must have 0 discrepancies");
  });

  await t.test("T-11: Cross-User Session & Package Binding Tampering (Composite FK Enforcement)", async () => {
    const db = new V4RelationalDatabase("t11");
    const { userA, userB } = setupUsers(db);

    const recA = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });

    // User B attempts to book User A's package via RPC -> 403 FORBIDDEN (42501)
    await assert.rejects(
      async () =>
        db.rpcCreateBookingWithHold(userB, {
          p_package_id: recA.packages[0].package_id,
          p_booking_code: "WM20261101"
        }),
      (err) => err.httpStatus === 403 && err.code === "42501"
    );

    // Direct relational insert with mismatched (package_id, user_id) violates Composite FK fk_bookings_package_user (23503)
    await assert.rejects(
      async () =>
        db.queryTableAsRole({
          role: "service_role",
          table: "bookings",
          action: "INSERT",
          payload: {
            booking_code: "WM20261102",
            user_id: userB,
            package_id: recA.packages[0].package_id,
            group_size: 2,
            expected_amount_vnd: 9000000,
            paid_amount_vnd: 0,
            status: "PENDING_PAYMENT"
          }
        }),
      (err) => err.code === "23503"
    );
  });

  await t.test("T-12: SECURITY DEFINER Search-Path Hijack & Privilege Escalation Attempt", async () => {
    const db = new V4RelationalDatabase("t12");
    const { userA } = setupUsers(db);

    // 1. Authenticated user attempts to create table in public schema -> 42501
    await assert.rejects(
      async () => db.executeDdlAsRole({ role: "authenticated", uid: userA, sql: "CREATE TABLE public.evil_roles (user_id uuid);" }),
      (err) => err.code === "42501"
    );

    // 2. Authenticated user creates pg_temp.user_roles and tries to spoof super_admin -> isAdmin(userA) still false because search_path = pg_catalog, public!
    await db.executeDdlAsRole({ role: "authenticated", uid: userA, sql: "CREATE TABLE pg_temp.user_roles (user_id uuid, role text);" });
    assert.equal(db.isAdmin(userA), false, "pg_temp.user_roles must never override public.user_roles");

    // 3. Authenticated user attempts to call service_role-only RPCs -> 42501
    await assert.rejects(
      async () => db.callRpcAsRole({ role: "authenticated", uid: userA, rpcName: "process_payment_webhook_v4", args: {} }),
      (err) => err.code === "42501"
    );
    await assert.rejects(
      async () => db.callRpcAsRole({ role: "authenticated", uid: userA, rpcName: "expire_stale_holds_v4", args: {} }),
      (err) => err.code === "42501"
    );

    // 4. Verify SQL migration 003 sets search_path = pg_catalog, public on every SECURITY DEFINER function
    const sql003 = fs.readFileSync(path.resolve("database/migrations/003_v4_atomic_rpcs.sql"), "utf8");
    const definerMatches = sql003.match(/SECURITY DEFINER/g) || [];
    const searchPathMatches = sql003.match(/SET search_path = pg_catalog, public/g) || [];
    assert.ok(definerMatches.length >= 11);
    assert.equal(definerMatches.length, searchPathMatches.length, "Every SECURITY DEFINER function must set search_path = pg_catalog, public");
  });

  await t.test("T-13: PII Encryption-at-Rest, Blind Index Uniqueness & Key Rotation Verification", async () => {
    const db = new V4RelationalDatabase("t13");
    const { userA, userB } = setupUsers(db);

    const rawCccd = "079099001234";
    const rawBank = "19038889991234";
    await db.upsertUserSensitivePii({
      userId: userA,
      cccdPlaintext: rawCccd,
      refundBankCode: "TECHCOMBANK",
      refundBankAccount: rawBank,
      refundBankHolder: "NGUYEN VAN A",
      env: TEST_ENV
    });

    // Duplicate CCCD across different user rejected by blind index unique constraint (23505)
    await assert.rejects(
      async () =>
        db.upsertUserSensitivePii({
          userId: userB,
          cccdPlaintext: rawCccd,
          refundBankCode: "MB",
          refundBankAccount: "0988111222",
          refundBankHolder: "TRAN THI B",
          env: TEST_ENV
        }),
      (err) => err.code === "23505"
    );

    const piiRow = db.tables.user_sensitive_pii[0];
    assert.equal(piiRow.cccd_ciphertext.includes(rawCccd), false, "Ciphertext must not contain plaintext CCCD");
    assert.equal(piiRow.cccd_last4, "1234");
    assert.equal(piiRow.cccd_key_version, 1);

    // Masked RPC returns only ********1234
    const masked = await db.rpcGetMyMaskedPii(userA);
    assert.equal(masked.cccd_masked, "********1234");
    assert.equal(masked.refund_bank_account_masked, "******1234");

    // Key rotation v1 -> v2
    const rotated = await db.rotatePiiKeyVersionBatch(TEST_ENV, 2);
    assert.equal(rotated.rotated_count, 1);
    assert.equal(db.tables.user_sensitive_pii[0].cccd_key_version, 2);
    const decryptedAfterRotation = await decryptPiiValue(
      db.tables.user_sensitive_pii[0].cccd_ciphertext,
      TEST_ENV
    );
    assert.equal(decryptedAfterRotation.plaintext, rawCccd);
    assert.equal(decryptedAfterRotation.keyVersion, 2);
  });

  await t.test("T-14: Outbox Crash-Recovery & At-Least-Once Delivery Idempotency", async () => {
    const db = new V4RelationalDatabase("t14");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20261401"
    });

    await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-OUTBOX-14",
      p_booking_code: "WM20261401",
      p_transfer_amount: book.expected_amount_vnd
    });

    const pendingOutbox = db.tables.outbox_events.filter((e) => e.aggregate_id === book.booking_id && e.status === "PENDING");
    assert.equal(pendingOutbox.length, 1, "Outbox must contain PENDING event inside same transaction");

    // First attempt fails -> schedules retry with exponential backoff
    await db.processOutboxBatch({
      bankGatewayFn: async () => {
        throw new Error("Downstream notification gateway timeout");
      }
    });
    const afterFail = db.tables.outbox_events.find((e) => e.id === pendingOutbox[0].id);
    assert.equal(afterFail.attempt_count, 1);
    assert.equal(afterFail.status, "PENDING");

    // Fast-forward time and process successfully
    const futureMs = Date.now() + 10000;
    const deliveredKeys = new Set();
    let sideEffectCount = 0;
    const gatewayFn = async (ev) => {
      if (!deliveredKeys.has(ev.idempotency_key)) {
        deliveredKeys.add(ev.idempotency_key);
        sideEffectCount += 1;
      }
      return { ok: true };
    };
    await db.processOutboxBatch({ bankGatewayFn: gatewayFn, nowMs: futureMs });
    await db.processOutboxBatch({ bankGatewayFn: gatewayFn, nowMs: futureMs + 5000 });

    const afterSuccess = db.tables.outbox_events.find((e) => e.id === pendingOutbox[0].id);
    assert.equal(afterSuccess.status, "PUBLISHED");
    assert.equal(sideEffectCount, 1, "Downstream consumer executed exactly once");
  });

  await t.test("T-15: Refund Gateway Timeout & `RECONCILIATION_REQUIRED` Lock", async () => {
    const db = new V4RelationalDatabase("t15");
    const { userA, adminId } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20261501"
    });
    await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-T15-1",
      p_booking_code: "WM20261501",
      p_transfer_amount: book.expected_amount_vnd
    });

    const ref = await db.rpcRequestRefund(userA, {
      p_booking_code: "WM20261501",
      p_mode: "REQUEST",
      p_tier: "EARLY_72H"
    });
    await db.rpcApproveRefund(adminId, { p_refund_id: ref.refund_id, p_decision: "APPROVE" });

    // Outbox worker experiences HTTP 504 timeout from bank gateway -> marks RECONCILIATION_REQUIRED
    await db.processOutboxBatch({
      bankGatewayFn: async () => {
        const err = new Error("Bank Gateway 504 Timeout");
        err.isTimeout = true;
        throw err;
      }
    });

    const refundRow = db.tables.refunds.find((r) => r.id === ref.refund_id);
    const bookingRow = db.tables.bookings.find((b) => b.id === book.booking_id);
    assert.equal(refundRow.status, "RECONCILIATION_REQUIRED");
    assert.equal(bookingRow.status, "REFUND_RECONCILIATION_REQUIRED");

    // Subsequent outbox poll skips RECONCILIATION_REQUIRED refund (never double-pays!)
    const pollWhileLocked = await db.processOutboxBatch({
      bankGatewayFn: async () => ({ payout_bank_ref: "SHOULD-NOT-RUN" })
    });
    assert.equal(pollWhileLocked[0].skipped, "RECONCILIATION_REQUIRED");

    // Reconcile via bank status inquiry API -> SUCCEEDED
    const reconRes = await db.reconcileRefundPayout({
      refundId: ref.refund_id,
      bankInquiryFn: async () => ({ bank_status: "SUCCEEDED", payout_bank_ref: "BANK-REF-88815" })
    });
    assert.equal(reconRes.status, "SUCCEEDED");
    assert.equal(db.tables.bookings.find((b) => b.id === book.booking_id).status, "REFUNDED");
  });

  await t.test("T-16: Booking Code Normalization & Spoofed Webhook Content Rejection", async () => {
    const db = new V4RelationalDatabase("t16");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });

    // Malformed booking code rejected by trg_enforce_booking_code_format (23514)
    await assert.rejects(
      async () =>
        db.rpcCreateBookingWithHold(userA, {
          p_package_id: rec.packages[0].package_id,
          p_booking_code: "WM-BAD!"
        }),
      (err) => err.code === "23514"
    );

    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20261601"
    });

    // Webhook with non-existent booking code in transfer_content -> 404 FAILED_UNMATCHED
    const unmatched = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-UNMATCHED-16",
      p_transfer_content: "Chuyen khoan WM99999999",
      p_transfer_amount: book.expected_amount_vnd
    });
    assert.equal(unmatched.http_status, 404);
    assert.equal(db.tables.bookings.find((b) => b.id === book.booking_id).paid_amount_vnd, 0);
  });

  await t.test("T-17: Invalid State Machine Transition Rejection (`trg_enforce_booking_state_transition`)", async () => {
    const db = new V4RelationalDatabase("t17");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20261701"
    });

    // Attempt PENDING_PAYMENT -> REVEALED directly -> 23514 ILLEGAL_BOOKING_STATE_TRANSITION
    await assert.rejects(
      async () =>
        db.queryTableAsRole({
          role: "service_role",
          table: "bookings",
          action: "UPDATE",
          filterFn: (b) => b.id === book.booking_id,
          payload: { status: "REVEALED" }
        }),
      (err) => err.code === "23514"
    );

    // Pay and reveal properly, then attempt REVEALED -> PENDING_PAYMENT -> 23514
    await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "SEP-T17-1",
      p_booking_code: "WM20261701",
      p_transfer_amount: book.expected_amount_vnd
    });
    await db.rpcRevealBlindBooking(userA, "WM20261701");

    await assert.rejects(
      async () =>
        db.queryTableAsRole({
          role: "service_role",
          table: "bookings",
          action: "UPDATE",
          filterFn: (b) => b.id === book.booking_id,
          payload: { status: "PENDING_PAYMENT" }
        }),
      (err) => err.code === "23514"
    );
  });

  await t.test("T-18: Multi-Provider Webhook Deduplication (`UNIQUE(payment_provider, external_transaction_id)`)", async () => {
    const db = new V4RelationalDatabase("t18");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book1 = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20261801"
    });
    const book2 = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[1].package_id,
      p_booking_code: "WM20261802"
    });

    // Same external_transaction_id ("TX-900") across SEPAY and CASSO both succeed independently
    const pSepay = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "TX-900",
      p_booking_code: "WM20261801",
      p_transfer_amount: book1.expected_amount_vnd
    });
    const pCasso = await db.rpcProcessPaymentWebhook({
      p_provider: "CASSO",
      p_external_tx_id: "TX-900",
      p_booking_code: "WM20261802",
      p_transfer_amount: book2.expected_amount_vnd
    });
    assert.equal(pSepay.idempotent_replay, false);
    assert.equal(pCasso.idempotent_replay, false);

    // Duplicate ("SEPAY", "TX-900") is deduplicated
    const pSepayDup = await db.rpcProcessPaymentWebhook({
      p_provider: "SEPAY",
      p_external_tx_id: "TX-900",
      p_booking_code: "WM20261801",
      p_transfer_amount: book1.expected_amount_vnd
    });
    assert.equal(pSepayDup.idempotent_replay, true);
  });

  await t.test("T-19: Hold Expiry Sweeper vs Concurrent Payment Lock Serialization", async () => {
    const db = new V4RelationalDatabase("t19");
    const { userA } = setupUsers(db);

    const rec = await db.createRecommendationSessionAndPackages({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15"
    });
    const book = await db.rpcCreateBookingWithHold(userA, {
      p_package_id: rec.packages[0].package_id,
      p_booking_code: "WM20261901"
    });

    // Set hold expiry in the past and race webhook against sweeper
    const bkRow = db.tables.bookings.find((b) => b.id === book.booking_id);
    bkRow.hold_expires_at = new Date(Date.now() - 50).toISOString();

    await Promise.all([
      db.rpcProcessPaymentWebhook({
        p_provider: "SEPAY",
        p_external_tx_id: "SEP-RACE-19",
        p_booking_code: "WM20261901",
        p_transfer_amount: book.expected_amount_vnd
      }),
      db.rpcExpireStaleHolds()
    ]);

    assert.equal(bkRow.status, "PAID", "Serialized lock re-acquires or commits inventory cleanly as PAID");
    const recon = await db.rpcRunReconciliationChecks();
    assert.equal(recon.total_discrepancy, 0, "All 7 reconciliation checks must have 0 anomalies");
  });

  await t.test("T-20: Quasi-Identifier Equivalence Class Attack Simulation (Adversarial Elimination Test)", async () => {
    const db = new V4RelationalDatabase("t20");
    const { userA } = setupUsers(db);

    // Deactivate Măng Đen so COOL_MIST_HIGHLAND has only 2 destinations (Đà Lạt & Sa Pa -> k=2 < 3)
    const mangDen = db.tables.destinations.find((d) => d.code_slug === "mang-den");
    mangDen.is_active = false;

    const out = runFiveStageRecommendationPipeline({
      userId: userA,
      originAirport: "SGN",
      budgetPerPersonVnd: 5500000,
      groupSize: 2,
      departureDate: "2026-11-15",
      durationDays: 3,
      userPreferences: { healing: 98, nature: 95, solitude: 90, comfort: 88, culture: 80 },
      catalog: db.tables
    });

    assert.ok(out.packages.length >= 1);
    for (const pkg of out.packages) {
      assert.ok(pkg.k_anonymity_count >= 3, `Expected k >= 3, got ${pkg.k_anonymity_count}`);
      if (pkg.destination.code_slug === "da-lat" || pkg.destination.code_slug === "sa-pa") {
        // Because COOL_MIST_HIGHLAND had k=2 < 3, enforceKAnonymityTuple generalized the bucket to VIETNAM_CURATED_SANCTUARY (k=8 >= 3)
        assert.equal(pkg.climate_bucket_id, "VIETNAM_CURATED_SANCTUARY");
        assert.equal(pkg.temp_range_label, "18°C – 28°C");
      }
    }
  });
});
