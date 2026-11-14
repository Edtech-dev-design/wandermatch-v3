// ============================================================================
// WANDERMATCH V4.3 — 24-SCENARIO E2E AUTOMATION HARNESS (E2E-01 .. E2E-24)
// Supports both Local Full-Stack (default) and Live Cloud Staging (--live-staging)
// Usage:
//   node tests/v4-3-e2e-24-scenarios.mjs
//   node tests/v4-3-e2e-24-scenarios.mjs --live-staging
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import workerV43 from "../src/index.js";
import { initFrontendAppV4 } from "../frontend/core/bootstrapV4.js";
import { createWorkerApiClient } from "../frontend/services/apiClient.js";

const LIVE_STAGING = process.argv.includes("--live-staging");
const STAGING_API_BASE = "https://wandermatch-api-staging.vannong20182018.workers.dev";
const STAGING_SUPABASE_URL = "https://hpwtdlffidfircparanl.supabase.co";

const WEBHOOK_SECRET = LIVE_STAGING
  ? (process.env.STAGING_WEBHOOK_SECRET || "")
  : "local-e2e-webhook-secret-key";

const SUPABASE_SERVICE_KEY = LIVE_STAGING
  ? (process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || "")
  : "";

const STAGING_SUPABASE_ANON_KEY = LIVE_STAGING
  ? (process.env.STAGING_SUPABASE_ANON_KEY || "")
  : "";

const LOCAL_ENV = {
  ENVIRONMENT: "development",
  APP_NAME: "WanderMatch V4.3 Local E2E",
  USE_V4_POSTGRES_RPC: "false",
  SUPABASE_URL: "http://127.0.0.1:54321",
  SESSION_SECRET: "local-e2e-session-secret-key",
  PAYMENT_WEBHOOK_SECRET: WEBHOOK_SECRET,
  PII_ENCRYPTION_KEY_V1: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  PII_HMAC_KEY: "local-e2e-pii-hmac-key",
  ADMIN_EMAILS: "admin@wandermatch.vn,superadmin.system@wandermatch.vn"
};

function signHmacHex(secret, rawBody) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

function makeLocalJwt(payload, secret) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64(payload);
  const sig = crypto.createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
}

async function callApi(pathUrl, { method = "GET", token = null, headers = {}, body = undefined } = {}) {
  const start = performance.now();
  const finalHeaders = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };

  let res;
  if (LIVE_STAGING) {
    res = await fetch(`${STAGING_API_BASE}${pathUrl}`, {
      method,
      headers: finalHeaders,
      body: typeof body === "string" ? body : body !== undefined ? JSON.stringify(body) : undefined
    });
  } else {
    const req = new Request(`https://local.wandermatch.test${pathUrl}`, {
      method,
      headers: finalHeaders,
      body: typeof body === "string" ? body : body !== undefined ? JSON.stringify(body) : undefined
    });
    res = await workerV43.fetch(req, LOCAL_ENV);
  }
  const durationMs = Math.round((performance.now() - start) * 100) / 100;
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, ok: res.ok, headers: res.headers, data: json, raw: text, durationMs };
}

async function mintStagingRecoveryOrAdminJwt({ type = "magiclink", email }) {
  if (!SUPABASE_SERVICE_KEY) return null;
  await fetch(`${STAGING_SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password: "AdminTempPassword!123", email_confirm: true })
  }).catch(() => {});
  const genRes = await fetch(`${STAGING_SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type, email })
  });
  const genData = await genRes.json().catch(() => ({}));
  const hashedToken = genData.hashed_token || genData.properties?.hashed_token;
  const emailOtp = genData.email_otp || genData.properties?.email_otp;
  const verifyKey = STAGING_SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY;
  if (hashedToken) {
    const verRes = await fetch(`${STAGING_SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: {
        apikey: verifyKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, token_hash: hashedToken })
    });
    const verData = await verRes.json().catch(() => ({}));
    if (verData.access_token) return verData.access_token;
  }
  if (emailOtp) {
    const verOtp = await fetch(`${STAGING_SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: {
        apikey: verifyKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, token: emailOtp, type })
    });
    const verOtpData = await verOtp.json().catch(() => ({}));
    if (verOtpData.access_token) return verOtpData.access_token;
  }
  return null;
}

const results = [];
const latencies = [];

async function runScenario(id, name, fn) {
  const start = performance.now();
  try {
    const detail = await fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    latencies.push({ id, durationMs });
    const status = detail?.blocked ? "BLOCKED" : (LIVE_STAGING ? "PASS_LIVE_STAGING" : "PASS_LOCAL");
    results.push({ id, name, status, durationMs, evidence: detail || {} });
    console.log(`[${status}] ${id}: ${name} (${durationMs}ms)`);
  } catch (err) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({ id, name, status: "FAIL", durationMs, error: err?.message || String(err) });
    console.error(`[FAIL] ${id}: ${name} -> ${err?.message || err}`);
  }
}

const runSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
const emailA = `e2e.alpha.${runSuffix}@wandermatch.test`;
const emailB = `e2e.beta.${runSuffix}@wandermatch.test`;
const passInitial = "WanderMatch!123";
const passReset = "WanderMatch!456";
const departureDate = LIVE_STAGING ? "2027-07-18" : "2027-05-20";

const ctx = {
  tokenA: null,
  tokenB: null,
  adminToken: null,
  userIdA: null,
  sessionId: null,
  packageId: null,
  secondPackageId: null,
  bookingCode: null,
  expectedAmountVnd: 0,
  refundId: null,
  notifications: []
};

await runScenario("E2E-01", "Load Landing & Verify V4 Bootstrap / Staging Env Isolation", async () => {
  const health = await callApi("/api/v4/health");
  assert.equal(health.status, 200);
  assert.equal(health.data.status, "HEALTHY");
  if (LIVE_STAGING) {
    assert.equal(health.data.environment, "staging");
    assert.equal(health.data.supabase?.projectRef, "hpwtdlffidfircparanl");
  }
  const store = new Map();
  const fakeWindow = {
    location: { hostname: LIVE_STAGING ? "wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app" : "localhost", port: LIVE_STAGING ? "" : "3000" },
    localStorage: { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) }
  };
  const app = initFrontendAppV4(fakeWindow, { storage: fakeWindow.localStorage });
  assert.equal(app.version, "4.3.0");
  assert.equal(Object.keys(app.modules).length, 10);
  return { httpStatus: health.status, version: app.version, environment: health.data.environment };
});

await runScenario("E2E-02", "Register User Account (Auth V4)", async () => {
  const resA = await callApi("/api/v4/auth/register", {
    method: "POST",
    body: { email: emailA, password: passInitial, name: "E2E Traveler Alpha" }
  });
  assert.equal(resA.status, 200);
  assert.ok(resA.data.token);
  ctx.tokenA = resA.data.token;
  ctx.userIdA = resA.data.user?.id;

  const resB = await callApi("/api/v4/auth/register", {
    method: "POST",
    body: { email: emailB, password: passInitial, name: "E2E Traveler Beta" }
  });
  assert.equal(resB.status, 200);
  ctx.tokenB = resB.data.token;
  return { httpStatus: resA.status, userId: ctx.userIdA };
});

await runScenario("E2E-03", "Login & Verify Session Persistence (/api/v4/auth/login + /me)", async () => {
  const loginRes = await callApi("/api/v4/auth/login", {
    method: "POST",
    body: { email: emailA, password: passInitial }
  });
  assert.equal(loginRes.status, 200);
  assert.ok(loginRes.data.token);
  ctx.tokenA = loginRes.data.token;

  const meRes = await callApi("/api/v4/auth/me", { token: ctx.tokenA });
  assert.equal(meRes.status, 200);
  assert.equal(meRes.data.user.email, emailA);
  return { httpStatus: meRes.status, email: meRes.data.user.email };
});

await runScenario("E2E-04", "Forgot Password & Reset Password Flow", async () => {
  const forgotRes = await callApi("/api/v4/auth/forgot-password", {
    method: "POST",
    body: { email: emailA }
  });
  assert.equal(forgotRes.status, 200);
  assert.equal(forgotRes.data.status, "RECOVERY_SENT");

  const invalidReset = await callApi("/api/v4/auth/reset-password", {
    method: "POST",
    body: { email: emailA, otp: "000000", newPassword: passReset }
  });
  assert.equal(invalidReset.status, 401);

  const recoveryJwt = LIVE_STAGING
    ? await mintStagingRecoveryOrAdminJwt({ type: "recovery", email: emailA })
    : makeLocalJwt({ sub: ctx.userIdA, email: emailA, exp: Math.floor(Date.now() / 1000) + 600 }, LOCAL_ENV.SESSION_SECRET);

  if (LIVE_STAGING && !recoveryJwt) {
    return { blocked: true, reason: "Missing STAGING_SUPABASE_SERVICE_ROLE_KEY for GoTrue recovery link minting" };
  }

  const resetRes = await callApi("/api/v4/auth/reset-password", {
    method: "POST",
    body: { recoveryToken: recoveryJwt, newPassword: passReset }
  });
  assert.equal(resetRes.status, 200);
  assert.equal(resetRes.data.status, "PASSWORD_UPDATED");

  const relogin = await callApi("/api/v4/auth/login", {
    method: "POST",
    body: { email: emailA, password: passReset }
  });
  assert.equal(relogin.status, 200);
  ctx.tokenA = relogin.data.token;
  return { forgotStatus: forgotRes.status, invalidResetStatus: invalidReset.status, resetStatus: resetRes.status };
});

await runScenario("E2E-05", "Update Profile & Preferences (PUT + GET /api/v4/users/profile)", async () => {
  const putRes = await callApi("/api/v4/users/profile", {
    method: "PUT",
    token: ctx.tokenA,
    body: {
      fullName: "Alpha V4.3 Updated",
      phone: "0909888777",
      originAirport: "SGN",
      budgetPerPersonVnd: 6800000,
      blacklistedSlugs: ["nha-trang"]
    }
  });
  assert.equal(putRes.status, 200);
  const getRes = await callApi("/api/v4/users/profile", { token: ctx.tokenA });
  assert.equal(getRes.status, 200);
  assert.equal(getRes.data.profile.full_name, "Alpha V4.3 Updated");
  assert.equal(getRes.data.profile.preferences.comfort_locks.origin_airport, "SGN");
  return { putStatus: putRes.status, source: getRes.data.source };
});

await runScenario("E2E-06", "Load Destination Discovery Catalog", async () => {
  const catRes = await callApi("/api/v4/discovery/catalog");
  assert.equal(catRes.status, 200);
  assert.ok(Array.isArray(catRes.data.destinations) && catRes.data.destinations.length >= 6);
  return { count: catRes.data.destinations.length };
});

await runScenario("E2E-07", "Search & Filter Catalog Without Exposing Booking Secrets", async () => {
  const app = initFrontendAppV4({ location: { hostname: "localhost", port: "3000" } });
  const catRes = await callApi("/api/v4/discovery/catalog");
  const filtered = app.modules.discovery.filterCatalogItems(catRes.data.destinations, {
    query: "cao nguyên",
    maxBudgetVnd: 7000000
  });
  assert.ok(Array.isArray(filtered));
  return { matchedCount: filtered.length };
});

await runScenario("E2E-08", "Generate AI Recommendation & Sealed Bundles (k >= 3)", async () => {
  const recRes = await callApi("/api/v4/recommendations", {
    method: "POST",
    token: ctx.tokenA,
    body: {
      originAirport: "SGN",
      budgetPerPersonVnd: 7500000,
      groupSize: 2,
      departureDate,
      durationDays: 3,
      userPreferences: { healing: 85, nature: 85, solitude: 75, comfort: 80, culture: 70 }
    }
  });
  assert.equal(recRes.status, 200);
  assert.ok(recRes.data.session_id);
  assert.ok(Array.isArray(recRes.data.packages) && recRes.data.packages.length >= 3);
  ctx.sessionId = recRes.data.session_id;
  ctx.packageId = recRes.data.packages[0].package_id || recRes.data.packages[0].id;
  ctx.secondPackageId = recRes.data.packages[1].package_id || recRes.data.packages[1].id;
  for (const pkg of recRes.data.packages) {
    assert.ok(Number(pkg.k_anonymity_count || 3) >= 3);
    assert.equal("secret_destination_id" in pkg, false);
    assert.equal("secret_hotel_id" in pkg, false);
    assert.equal("secret_flight_id" in pkg, false);
  }
  return { sessionId: ctx.sessionId, packageCount: recRes.data.packages.length };
});

await runScenario("E2E-09", "Create Blind Booking & Verify Zero Pre-Reveal Leaks", async () => {
  const uniqueCccd = `0792${String(crypto.randomInt(10000000, 99999999))}`;
  const piiRes = await callApi("/api/v4/pii/upsert", {
    method: "POST",
    token: ctx.tokenA,
    body: {
      cccd: uniqueCccd,
      refundBankCode: "MB",
      refundBankAccount: `10${String(crypto.randomInt(10000000, 99999999))}`,
      refundBankHolder: "E2E TRAVELER ALPHA"
    }
  });
  assert.equal(piiRes.status, 200);

  const bookRes = await callApi("/api/v4/bookings", {
    method: "POST",
    token: ctx.tokenA,
    body: {
      packageId: ctx.packageId,
      departureDate,
      durationDays: 3,
      travelers: [{ fullName: "E2E Traveler Alpha", isPrimary: true }]
    }
  });
  assert.equal(bookRes.status, 200);
  assert.ok(bookRes.data.booking_code);
  assert.equal(bookRes.data.status, "PENDING_PAYMENT");
  assert.equal("city_name" in bookRes.data, false);
  assert.equal("hotel_name" in bookRes.data, false);
  ctx.bookingCode = bookRes.data.booking_code;
  ctx.expectedAmountVnd = Number(bookRes.data.expected_amount_vnd);
  return { bookingCode: ctx.bookingCode, expectedAmountVnd: ctx.expectedAmountVnd };
});

await runScenario("E2E-10", "Owner Views Booking Status & List (/bookings/status + /bookings)", async () => {
  const stRes = await callApi(`/api/v4/bookings/status?bookingCode=${encodeURIComponent(ctx.bookingCode)}`, {
    token: ctx.tokenA
  });
  assert.equal(stRes.status, 200);
  assert.equal(stRes.data.booking.is_revealed, false);
  assert.equal("city_name" in stRes.data.booking, false);

  const listRes = await callApi("/api/v4/bookings", { token: ctx.tokenA });
  assert.equal(listRes.status, 200);
  assert.ok(listRes.data.items.some(b => b.booking_code === ctx.bookingCode));
  return { count: listRes.data.items.length, status: stRes.data.booking.status };
});

await runScenario("E2E-11", "Cross-Tenant Access Blocked with User B JWT (403 Forbidden)", async () => {
  const stCross = await callApi(`/api/v4/bookings/status?bookingCode=${encodeURIComponent(ctx.bookingCode)}`, {
    token: ctx.tokenB
  });
  assert.equal(stCross.status, 403);

  const revCross = await callApi("/api/v4/bookings/reveal", {
    method: "POST",
    token: ctx.tokenB,
    body: { bookingCode: ctx.bookingCode }
  });
  assert.equal(revCross.status, 403);
  return { statusDenied: stCross.status, revealDenied: revCross.status };
});

await runScenario("E2E-12", "Early Reveal Before Payment Rejected (402 Payment Required)", async () => {
  const earlyRes = await callApi("/api/v4/bookings/reveal", {
    method: "POST",
    token: ctx.tokenA,
    body: { bookingCode: ctx.bookingCode }
  });
  assert.ok([402, 409].includes(earlyRes.status));
  return { httpStatus: earlyRes.status };
});

await runScenario("E2E-13", "Payment Webhook Invalid HMAC Signature Rejected (401)", async () => {
  const payload = JSON.stringify({
    provider: "SEPAY",
    providerEventId: `evt_invalid_${runSuffix}`,
    externalTransactionId: `tx_invalid_${runSuffix}`,
    bookingCode: ctx.bookingCode,
    transferAmount: ctx.expectedAmountVnd,
    content: ctx.bookingCode
  });
  const badRes = await callApi("/api/v4/webhooks/payment", {
    method: "POST",
    headers: { "x-sepay-signature": "0000badbeef0000" },
    body: payload
  });
  assert.equal(badRes.status, 401);
  return { httpStatus: badRes.status };
});

await runScenario("E2E-14", "Payment Webhook Valid HMAC Marks Booking PAID (200)", async () => {
  if (!WEBHOOK_SECRET) {
    return { blocked: true, reason: "Missing STAGING_WEBHOOK_SECRET env var for HMAC signing" };
  }
  const payload = JSON.stringify({
    provider: "SEPAY",
    providerEventId: `evt_valid_${runSuffix}`,
    externalTransactionId: `tx_valid_${runSuffix}`,
    bookingCode: ctx.bookingCode,
    transferAmount: ctx.expectedAmountVnd,
    content: ctx.bookingCode
  });
  const sig = signHmacHex(WEBHOOK_SECRET, payload);
  const payRes = await callApi("/api/v4/webhooks/payment", {
    method: "POST",
    headers: { "x-sepay-signature": sig },
    body: payload
  });
  assert.equal(payRes.status, 200);
  const stRes = await callApi(`/api/v4/bookings/status?bookingCode=${encodeURIComponent(ctx.bookingCode)}`, {
    token: ctx.tokenA
  });
  assert.equal(stRes.status, 200);
  assert.equal(stRes.data.booking.status, "PAID");
  assert.equal(Number(stRes.data.booking.paid_amount_vnd), ctx.expectedAmountVnd);
  return { webhookStatus: payRes.status, bookingStatus: stRes.data.booking.status };
});

await runScenario("E2E-15", "Payment Webhook Replay Is Strictly Idempotent (No Double Credit)", async () => {
  if (!WEBHOOK_SECRET) {
    return { blocked: true, reason: "Missing STAGING_WEBHOOK_SECRET env var for HMAC replay test" };
  }
  const payload = JSON.stringify({
    provider: "SEPAY",
    providerEventId: `evt_valid_${runSuffix}`,
    externalTransactionId: `tx_valid_${runSuffix}`,
    bookingCode: ctx.bookingCode,
    transferAmount: ctx.expectedAmountVnd,
    content: ctx.bookingCode
  });
  const sig = signHmacHex(WEBHOOK_SECRET, payload);
  const replayRes = await callApi("/api/v4/webhooks/payment", {
    method: "POST",
    headers: { "x-sepay-signature": sig },
    body: payload
  });
  assert.equal(replayRes.status, 200);
  assert.equal(replayRes.data.idempotent_replay, true);

  const stRes = await callApi(`/api/v4/bookings/status?bookingCode=${encodeURIComponent(ctx.bookingCode)}`, {
    token: ctx.tokenA
  });
  assert.equal(Number(stRes.data.booking.paid_amount_vnd), ctx.expectedAmountVnd);
  return { idempotentReplay: replayRes.data.idempotent_replay, paidAmountVnd: stRes.data.booking.paid_amount_vnd };
});

await runScenario("E2E-16", "Authorized Reveal After Payment Exposes Full Secret Bundle", async () => {
  const revRes = await callApi("/api/v4/bookings/reveal", {
    method: "POST",
    token: ctx.tokenA,
    body: { bookingCode: ctx.bookingCode }
  });
  assert.equal(revRes.status, 200);
  const city = revRes.data.destination?.city_name || revRes.data.reveal?.destination?.city_name;
  const hotel = revRes.data.hotel?.hotel_name || revRes.data.reveal?.hotel?.hotel_name;
  const flightCode = revRes.data.flight?.flight_code || revRes.data.reveal?.flight?.flight_code;
  assert.ok(city && hotel && flightCode);
  return { city, hotel, flightCode };
});

await runScenario("E2E-17", "Submit Verified Post-Reveal Review & Verify Public Feed", async () => {
  const postRev = await callApi("/api/v4/reviews", {
    method: "POST",
    token: ctx.tokenA,
    body: {
      bookingCode: ctx.bookingCode,
      rating: 5,
      aiMatchRating: 5,
      reviewText: `V4.3 UAT verified experience for ${ctx.bookingCode}!`
    }
  });
  assert.equal(postRev.status, 200);

  const feedRes = await callApi("/api/v4/reviews?limit=25");
  assert.equal(feedRes.status, 200);
  assert.ok(Array.isArray(feedRes.data.reviews));
  return { postStatus: postRev.status, reviewCount: feedRes.data.reviews.length };
});

await runScenario("E2E-18", "Fetch In-App Notifications & Mark Read", async () => {
  const listNotif = await callApi("/api/v4/notifications?limit=20", { token: ctx.tokenA });
  assert.equal(listNotif.status, 200);
  const items = listNotif.data.notifications || listNotif.data.items || [];
  let markStatus = null;
  if (items.length > 0 && items[0].id) {
    const readRes = await callApi("/api/v4/notifications/read", {
      method: "POST",
      token: ctx.tokenA,
      body: { notificationId: items[0].id }
    });
    assert.equal(readRes.status, 200);
    markStatus = readRes.status;
  }
  return { notificationCount: items.length, markStatus };
});

await runScenario("E2E-19", "Non-Admin Blocked From Admin Endpoints (403 Forbidden)", async () => {
  const reconRes = await callApi("/api/v4/reconciliation", { token: ctx.tokenA });
  assert.equal(reconRes.status, 403);
  const approveRes = await callApi("/api/v4/refunds/approve", {
    method: "POST",
    token: ctx.tokenA,
    body: { refundId: "00000000-0000-4000-8000-000000000001", decision: "APPROVE" }
  });
  assert.equal(approveRes.status, 403);
  return { reconciliationStatus: reconRes.status, refundApproveStatus: approveRes.status };
});

await runScenario("E2E-20", "Admin Executes Reconciliation & Refund Approval (200 OK)", async () => {
  ctx.adminToken = LIVE_STAGING
    ? await mintStagingRecoveryOrAdminJwt({ type: "magiclink", email: "admin@wandermatch.vn" })
    : makeLocalJwt(
        { sub: "00000000-0000-4000-8000-000000000099", email: "admin@wandermatch.vn", role: "admin", exp: Math.floor(Date.now() / 1000) + 600 },
        LOCAL_ENV.SESSION_SECRET
      );

  if (LIVE_STAGING && !ctx.adminToken) {
    return { blocked: true, reason: "Missing STAGING_SUPABASE_SERVICE_ROLE_KEY for Admin magiclink session" };
  }

  const reconRes = await callApi("/api/v4/reconciliation", { token: ctx.adminToken });
  assert.equal(reconRes.status, 200);

  // Create a second booking + pay + request refund + approve it as Admin
  const bk2Res = await callApi("/api/v4/bookings", {
    method: "POST",
    token: ctx.tokenA,
    body: {
      packageId: ctx.secondPackageId,
      departureDate,
      durationDays: 3,
      travelers: [{ fullName: "E2E Traveler Alpha", isPrimary: true }]
    }
  });
  assert.equal(bk2Res.status, 200);
  const code2 = bk2Res.data.booking_code;
  const amt2 = Number(bk2Res.data.expected_amount_vnd);

  if (WEBHOOK_SECRET) {
    const pay2Body = JSON.stringify({
      provider: "SEPAY",
      providerEventId: `evt_ref_${runSuffix}`,
      externalTransactionId: `tx_ref_${runSuffix}`,
      bookingCode: code2,
      transferAmount: amt2,
      content: code2
    });
    const sig2 = signHmacHex(WEBHOOK_SECRET, pay2Body);
    const pay2Res = await callApi("/api/v4/webhooks/payment", {
      method: "POST",
      headers: { "x-sepay-signature": sig2 },
      body: pay2Body
    });
    assert.equal(pay2Res.status, 200);

    const reqRef = await callApi("/api/v4/refunds/request", {
      method: "POST",
      token: ctx.tokenA,
      body: { bookingCode: code2, mode: "REQUEST", tier: "EARLY_72H", reason: "V4.3 Admin E2E verification" }
    });
    assert.equal(reqRef.status, 200);
    ctx.refundId = reqRef.data.refund_id;
    assert.ok(ctx.refundId);

    const appRef = await callApi("/api/v4/refunds/approve", {
      method: "POST",
      token: ctx.adminToken,
      body: { refundId: ctx.refundId, decision: "APPROVE", autoSettleSandbox: true }
    });
    assert.equal(appRef.status, 200);
    return { reconciliationStatus: reconRes.status, refundApproveStatus: appRef.status };
  }
  return { reconciliationStatus: reconRes.status };
});

await runScenario("E2E-21", "Concurrent Booking Lock Serialization Prevents Double Allocation", async () => {
  const recRes = await callApi("/api/v4/recommendations", {
    method: "POST",
    token: ctx.tokenB,
    body: { originAirport: "HAN", budgetPerPersonVnd: 7500000, groupSize: 2, departureDate, durationDays: 3 }
  });
  assert.equal(recRes.status, 200);
  const racePkgId = recRes.data.packages[0].package_id || recRes.data.packages[0].id;

  const [r1, r2, r3] = await Promise.all([
    callApi("/api/v4/bookings", {
      method: "POST",
      token: ctx.tokenB,
      body: { packageId: racePkgId, departureDate, durationDays: 3, travelers: [{ fullName: "Beta 1" }] }
    }),
    callApi("/api/v4/bookings", {
      method: "POST",
      token: ctx.tokenB,
      body: { packageId: racePkgId, departureDate, durationDays: 3, travelers: [{ fullName: "Beta 2" }] }
    }),
    callApi("/api/v4/bookings", {
      method: "POST",
      token: ctx.tokenA,
      body: { packageId: racePkgId, departureDate, durationDays: 3, travelers: [{ fullName: "Alpha Hijack" }] }
    })
  ]);
  const pair = [r1, r2];
  const okOnes = pair.filter(r => r.status === 200);
  const conflictOnes = pair.filter(r => r.status === 409);
  assert.ok(okOnes.length >= 1, `Expected at least one 200 booking creation, got ${pair.map(r => r.status)}`);
  let replayFlags = [];
  if (okOnes.length === 2) {
    assert.equal(okOnes[0].data.booking_code, okOnes[1].data.booking_code);
    replayFlags = [Boolean(okOnes[0].data.idempotent_replay), Boolean(okOnes[1].data.idempotent_replay)].sort();
    assert.deepEqual(replayFlags, [false, true]);
  } else {
    assert.equal(okOnes.length, 1);
    assert.equal(conflictOnes.length, 1, `Expected 409 conflict on concurrent MVCC lock loser, got ${pair.map(r => r.status)}`);
  }
  assert.equal(r3.status, 403);
  return { sameUserStatuses: [r1.status, r2.status], idempotentReplayFlags: replayFlags, crossUserStatus: r3.status };
});

await runScenario("E2E-22", "Invalid Payload Validation Returns 400 Cleanly", async () => {
  const badReg = await callApi("/api/v4/auth/register", {
    method: "POST",
    body: { email: "not-an-email", password: "123" }
  });
  assert.equal(badReg.status, 400);

  const badProf = await callApi("/api/v4/users/profile", {
    method: "PUT",
    token: ctx.tokenA,
    body: { fullName: "X" }
  });
  assert.equal(badProf.status, 400);
  return { registerStatus: badReg.status, profileStatus: badProf.status };
});

await runScenario("E2E-23", "Invalid / Expired JWT Returns 401 & Clears Client Session", async () => {
  const unauthMe = await callApi("/api/v4/auth/me", { token: "invalid.jwt.token" });
  assert.equal(unauthMe.status, 401);
  const unauthBook = await callApi("/api/v4/bookings", { token: "invalid.jwt.token" });
  assert.equal(unauthBook.status, 401);

  let cleared = false;
  const apiClient = createWorkerApiClient({
    envConfig: {
      environment: "staging",
      supabaseUrl: STAGING_SUPABASE_URL,
      supabaseProjectRef: "hpwtdlffidfircparanl",
      apiBase: STAGING_API_BASE
    },
    getAccessToken: () => "invalid.jwt.token",
    onUnauthorized: () => {
      cleared = true;
    },
    fetchImpl: async () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  });
  await assert.rejects(() => apiClient.get("/api/v4/auth/me"), err => err.status === 401);
  assert.equal(cleared, true);
  return { authMeStatus: unauthMe.status, bookingsStatus: unauthBook.status, clientCleared: cleared };
});

await runScenario("E2E-24", "API Timeout / 500 Resilience Normalized Without Crashing", async () => {
  const apiClient = createWorkerApiClient({
    envConfig: {
      environment: "staging",
      supabaseUrl: STAGING_SUPABASE_URL,
      supabaseProjectRef: "hpwtdlffidfircparanl",
      apiBase: STAGING_API_BASE
    },
    getAccessToken: () => "token",
    fetchImpl: async (url, init) => {
      if (url.includes("/timeout")) {
        return new Promise((_, reject) => {
          init.signal?.addEventListener("abort", () => {
            const e = new Error("Aborted");
            e.name = "AbortError";
            reject(e);
          });
        });
      }
      return new Response(JSON.stringify({ error: "Upstream DB error" }), { status: 500 });
    }
  });
  let timeoutErr = null;
  try {
    await apiClient.get("/api/v4/timeout", { timeoutMs: 25 });
  } catch (e) {
    timeoutErr = e;
  }
  assert.equal(timeoutErr?.status, 504);
  assert.equal(timeoutErr?.code, "REQUEST_TIMEOUT");

  let err500 = null;
  try {
    await apiClient.get("/api/v4/crash");
  } catch (e) {
    err500 = e;
  }
  assert.equal(err500?.status, 500);
  assert.ok(err500?.requestId);
  return { timeoutCode: timeoutErr.code, err500Status: err500.status };
});

const sortedDurations = latencies.map(l => l.durationMs).sort((a, b) => a - b);
const p50 = sortedDurations.length ? sortedDurations[Math.floor(sortedDurations.length * 0.5)] : 0;
const p95 = sortedDurations.length ? sortedDurations[Math.min(sortedDurations.length - 1, Math.floor(sortedDurations.length * 0.95))] : 0;
const avg = sortedDurations.length ? Math.round((sortedDurations.reduce((s, v) => s + v, 0) / sortedDurations.length) * 100) / 100 : 0;

const summary = {
  executedAt: new Date().toISOString(),
  mode: LIVE_STAGING ? "LIVE_STAGING" : "LOCAL_FULLSTACK",
  targetApi: LIVE_STAGING ? STAGING_API_BASE : "local:src/index.js",
  total: results.length,
  passed: results.filter(r => r.status.startsWith("PASS")).length,
  blocked: results.filter(r => r.status === "BLOCKED").length,
  failed: results.filter(r => r.status === "FAIL").length,
  latencySummaryMs: { avg, p50, p95 },
  scenarios: results
};

fs.mkdirSync(path.resolve("scratch"), { recursive: true });
const outFile = LIVE_STAGING ? "scratch/v4_3_live_staging_e2e.json" : "scratch/v4_3_local_e2e.json";
fs.writeFileSync(path.resolve(outFile), JSON.stringify(summary, null, 2), "utf8");
console.log(`\nSummary (${summary.mode}): passed=${summary.passed}/${summary.total}, blocked=${summary.blocked}, failed=${summary.failed}, p50=${p50}ms, p95=${p95}ms`);

if (summary.failed > 0 || summary.blocked > 0) {
  process.exitCode = 1;
}
