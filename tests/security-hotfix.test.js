import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker.js";

function createTestEnv() {
  return {
    SESSION_SECRET: "unit-test-strong-session-secret-key-2026",
    PAYMENT_WEBHOOK_SECRET: "unit-test-strong-webhook-secret-2026",
    ADMIN_EMAILS: "admin@wandermatch.vn",
    AI: {
      async run() {
        return {
          response: JSON.stringify({
            archetype: "Mindful Explorer",
            vibe_match_score: 94,
            psychographic_analysis: "Loves quiet nature retreats."
          })
        };
      }
    }
  };
}

async function callWorker(path, { method = "GET", body, headers = {}, env } = {}) {
  const activeEnv = env || createTestEnv();
  const reqHeaders = { ...headers };
  if (body !== undefined) {
    reqHeaders["Content-Type"] = "application/json";
  }
  const request = new Request(`http://localhost${path}`, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const response = await worker.fetch(request, activeEnv);
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  return { response, status: response.status, data };
}

test("1 & 2 & 3. Admin API protection: unauthenticated (401), regular user (403), valid admin (200)", async () => {
  const env = createTestEnv();

  // 1. Unauthenticated user calls Admin API -> 401
  const unauthRes = await callWorker("/api/admin-summary", { env });
  assert.equal(unauthRes.status, 401, "Unauthenticated request to /api/admin-summary must return 401");
  assert.equal(unauthRes.data?.bookings, undefined, "Must not leak bookings PII to unauthenticated caller");

  // 2. Regular user registers (even attempting role spoofing in body) and calls Admin API -> 403
  const regUser = await callWorker("/api/auth/register", {
    method: "POST",
    env,
    body: {
      email: "regular.user@example.com",
      password: "Password123!",
      name: "Regular User",
      role: "admin" // Attempted privilege escalation via body
    }
  });
  assert.equal(regUser.status, 200);
  assert.ok(regUser.data.token);
  assert.notEqual(regUser.data.user.role, "admin", "Client-supplied role in register body must be ignored");

  const userAdminAttempt = await callWorker("/api/admin-summary", {
    env,
    headers: { Authorization: `Bearer ${regUser.data.token}` }
  });
  assert.equal(userAdminAttempt.status, 403, "Regular user calling /api/admin-summary must receive 403");
  assert.equal(userAdminAttempt.data?.bookings, undefined, "Must not leak bookings to non-admin user");

  // 3. Valid Admin registers/logs in and calls Admin API -> 200
  const regAdmin = await callWorker("/api/auth/register", {
    method: "POST",
    env,
    body: {
      email: "admin@wandermatch.vn",
      password: "AdminPassword123!",
      name: "System Admin"
    }
  });
  assert.equal(regAdmin.status, 200);
  assert.equal(regAdmin.data.user.role, "admin");

  const adminRes = await callWorker("/api/admin-summary", {
    env,
    headers: { Authorization: `Bearer ${regAdmin.data.token}` }
  });
  assert.equal(adminRes.status, 200, "Valid admin must receive 200 from /api/admin-summary");
  assert.equal(adminRes.data.success, true);
  assert.ok(Array.isArray(adminRes.data.bookings));
});

test("4. Authentication: login with wrong password must fail with 401", async () => {
  const env = createTestEnv();
  await callWorker("/api/auth/register", {
    method: "POST",
    env,
    body: {
      email: "authcheck@example.com",
      password: "CorrectHorseBatteryStaple1!",
      name: "Auth User"
    }
  });

  const badLogin = await callWorker("/api/auth/login", {
    method: "POST",
    env,
    body: {
      email: "authcheck@example.com",
      password: "WrongPassword999!"
    }
  });
  assert.equal(badLogin.status, 401);
  assert.equal(badLogin.data.success, false);
  assert.equal(badLogin.data.token, undefined);
});

test("5, 6, 7. Blind recommendation secrecy, deterministic package locking, price tampering protection, ownership & duplicate booking prevention", async () => {
  const env = createTestEnv();

  // Register User A and User B
  const userA = await callWorker("/api/auth/register", {
    method: "POST",
    env,
    body: { email: "usera@example.com", password: "Password123!", name: "User A" }
  });
  const userB = await callWorker("/api/auth/register", {
    method: "POST",
    env,
    body: { email: "userb@example.com", password: "Password123!", name: "User B" }
  });
  const tokenA = userA.data.token;
  const tokenB = userB.data.token;

  // User A requests recommendation
  const recRes = await callWorker("/api/ai-recommend", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      originAirport: "SGN",
      budgetVnd: 6000000,
      groupSize: 2,
      userVector: { healing: 95, nature: 90, solitude: 85, comfort: 90, culture: 80 },
      blacklistCities: []
    }
  });
  assert.equal(recRes.status, 200);
  assert.ok(recRes.data.recommendationId, "Must issue a recommendationId");
  assert.ok(recRes.data.packageId, "Must issue a deterministic packageId");
  assert.ok(recRes.data.expectedAmount > 0, "Must return authoritative expectedAmount");

  // Blind Booking Security check: response MUST NOT leak destination cityName or hotelName before reveal!
  assert.equal(recRes.data.revealPackage?.cityName, undefined, "Must NOT leak revealPackage.cityName in recommendation response");
  assert.equal(recRes.data.revealPackage?.hotelName, undefined, "Must NOT leak revealPackage.hotelName in recommendation response");
  for (const opt of recRes.data.top3Curated || []) {
    assert.equal(opt.cityName, undefined, "top3Curated must NOT leak cityName before reveal");
    assert.equal(opt.hotelName, undefined, "top3Curated must NOT leak hotelName before reveal");
    assert.ok(opt.packageId, "Each curated option must have a selectable packageId");
  }

  // Test 7: User B tries to book User A's packageId -> must fail with 403
  const hijackAttempt = await callWorker("/api/create-booking", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenB}` },
    body: {
      packageId: recRes.data.packageId,
      recommendationId: recRes.data.recommendationId,
      fullName: "User B Hijacker",
      email: "userb@example.com",
      groupSize: 2
    }
  });
  assert.equal(hijackAttempt.status, 403, "User B must not be allowed to book User A's packageId");

  // Test 6: User A tries to tamper with price in booking request -> server must ignore tampered price
  const bookingCode = "WM77001";
  const bookRes1 = await callWorker("/api/create-booking", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      bookingCode,
      packageId: recRes.data.packageId,
      recommendationId: recRes.data.recommendationId,
      fullName: "User A",
      email: "usera@example.com",
      budgetVnd: 50000, // Tampered ultra-low budget
      expectedAmount: 1000, // Tampered expectedAmount
      packageCost: 1000, // Tampered packageCost
      groupSize: 2
    }
  });
  assert.equal(bookRes1.status, 200);
  assert.equal(bookRes1.data.bookingCode, bookingCode);
  assert.equal(
    bookRes1.data.expectedAmount,
    recRes.data.expectedAmount,
    "Server must enforce server-calculated expectedAmount and ignore client price tampering"
  );
  assert.equal(bookRes1.data.revealPackage?.cityName, undefined, "Booking creation must not leak cityName before payment");

  // Test 5: User A sends duplicate booking request -> must be idempotent, not create duplicate records
  const bookRes2 = await callWorker("/api/create-booking", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      bookingCode,
      packageId: recRes.data.packageId,
      recommendationId: recRes.data.recommendationId,
      fullName: "User A",
      email: "usera@example.com",
      groupSize: 2
    }
  });
  assert.equal(bookRes2.status, 200);
  assert.equal(bookRes2.data.bookingCode, bookingCode);

  // Verify via admin API that only 1 booking with WM77001 exists
  const adminTokenRes = await callWorker("/api/auth/login", {
    method: "POST",
    env,
    body: { email: "admin@wandermatch.vn", password: "AdminPassword123!" }
  });
  const summary = await callWorker("/api/admin-summary", {
    env,
    headers: { Authorization: `Bearer ${adminTokenRes.data.token}` }
  });
  const matchingBookings = summary.data.bookings.filter(b => b.bookingCode === bookingCode);
  assert.equal(matchingBookings.length, 1, "Duplicate booking requests must not create duplicate booking rows");
});

test("8, 9, 10, 11, 12. Payment reconciliation, webhook idempotency, ownership checks, and blind reveal policy", async () => {
  const env = createTestEnv();

  const loginA = await callWorker("/api/auth/login", {
    method: "POST",
    env,
    body: { email: "usera@example.com", password: "Password123!" }
  });
  const loginB = await callWorker("/api/auth/login", {
    method: "POST",
    env,
    body: { email: "userb@example.com", password: "Password123!" }
  });
  const tokenA = loginA.data.token;
  const tokenB = loginB.data.token;

  const rec = await callWorker("/api/ai-recommend", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      originAirport: "SGN",
      budgetVnd: 6500000,
      groupSize: 2
    }
  });
  const expectedAmount = rec.data.expectedAmount;
  const bookingCode = "WM88002";

  const book = await callWorker("/api/create-booking", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      bookingCode,
      packageId: rec.data.packageId,
      recommendationId: rec.data.recommendationId,
      fullName: "User A",
      email: "usera@example.com",
      groupSize: 2
    }
  });
  assert.equal(book.status, 200);
  assert.equal(book.data.expectedAmount, expectedAmount);

  // Test 12: User B tries to check status or reveal User A's booking -> 403
  const statusByB = await callWorker(`/api/payment/check-status?bookingCode=${bookingCode}`, {
    env,
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  assert.equal(statusByB.status, 403, "User B must not be allowed to view User A's booking payment status");

  const revealByB = await callWorker("/api/bookings/reveal", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenB}` },
    body: { bookingCode }
  });
  assert.equal(revealByB.status, 403, "User B must not be allowed to reveal User A's booking");

  // Test 11: Unpaid User A tries to reveal destination -> must fail (402 or 403)
  const revealUnpaid = await callWorker("/api/bookings/reveal", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: { bookingCode }
  });
  assert.ok([402, 403].includes(revealUnpaid.status), "Unpaid booking must NOT be allowed to reveal destination");
  assert.equal(revealUnpaid.data?.revealPackage, undefined);

  // Test 9a: Webhook for non-existent booking -> must return 404 (not create a PAID dummy booking)
  const ghostWebhook = await callWorker("/api/payment/webhook", {
    method: "POST",
    env,
    headers: { "x-webhook-secret": env.PAYMENT_WEBHOOK_SECRET },
    body: {
      id: "TXN-GHOST-1",
      content: "Thanh toan WM99999",
      transferAmount: 5000000
    }
  });
  assert.equal(ghostWebhook.status, 404, "Webhook for non-existent booking must return 404");

  // Test 9b: Webhook sends LESS than expectedAmount (Underpaid) -> must NOT become PAID
  const partialAmount = Math.floor(expectedAmount / 2);
  const underpaidWebhook = await callWorker("/api/payment/webhook", {
    method: "POST",
    env,
    headers: { "x-webhook-secret": env.PAYMENT_WEBHOOK_SECRET },
    body: {
      id: "TXN-PARTIAL-1",
      content: `Chuyen khoan ${bookingCode}`,
      transferAmount: partialAmount
    }
  });
  assert.equal(underpaidWebhook.status, 200);
  assert.equal(underpaidWebhook.data.status, "UNDERPAID", "Partial payment must set status to UNDERPAID, not PAID");

  const statusAfterPartial = await callWorker(`/api/payment/check-status?bookingCode=${bookingCode}`, {
    env,
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  assert.equal(statusAfterPartial.status, 200);
  assert.equal(statusAfterPartial.data.isPaid, false, "Underpaid booking must have isPaid = false");
  assert.equal(statusAfterPartial.data.paidAmount, partialAmount);
  assert.equal(statusAfterPartial.data.amountDue, expectedAmount - partialAmount);

  // Test 8: Webhook replays the EXACT SAME transactionId ("TXN-PARTIAL-1") -> must NOT double-add amount!
  const replayWebhook = await callWorker("/api/payment/webhook", {
    method: "POST",
    env,
    headers: { "x-webhook-secret": env.PAYMENT_WEBHOOK_SECRET },
    body: {
      id: "TXN-PARTIAL-1",
      content: `Chuyen khoan ${bookingCode}`,
      transferAmount: partialAmount
    }
  });
  assert.equal(replayWebhook.status, 200);
  assert.equal(replayWebhook.data.idempotentReplay, true, "Duplicate transactionId must be flagged as idempotentReplay");
  assert.equal(replayWebhook.data.status, "UNDERPAID", "Replaying partial payment must not flip booking to PAID");

  // Test 10: Webhook sends remaining amount -> booking becomes PAID
  const remainingAmount = expectedAmount - partialAmount;
  const finalWebhook = await callWorker("/api/payment/webhook", {
    method: "POST",
    env,
    headers: { "x-webhook-secret": env.PAYMENT_WEBHOOK_SECRET },
    body: {
      id: "TXN-FINAL-2",
      content: `Chuyen khoan not ${bookingCode}`,
      transferAmount: remainingAmount
    }
  });
  assert.equal(finalWebhook.status, 200);
  assert.equal(finalWebhook.data.status, "PAID", "Completing expectedAmount must mark booking PAID");

  // Now User A (owner, PAID) calls reveal endpoint -> 200 OK with secret destination details
  const revealPaid = await callWorker("/api/bookings/reveal", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: { bookingCode }
  });
  assert.equal(revealPaid.status, 200, "Paid owner must be able to reveal destination");
  assert.ok(revealPaid.data.revealPackage?.cityName, "Reveal endpoint must return cityName once paid");
  assert.ok(revealPaid.data.revealPackage?.hotelName, "Reveal endpoint must return hotelName once paid");

  // Test 9c: Overpayment test on a new booking
  const recOver = await callWorker("/api/ai-recommend", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: { originAirport: "SGN", budgetVnd: 6000000, groupSize: 1 }
  });
  const bookOverCode = "WM88003";
  await callWorker("/api/create-booking", {
    method: "POST",
    env,
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      bookingCode: bookOverCode,
      packageId: recOver.data.packageId,
      recommendationId: recOver.data.recommendationId,
      fullName: "User A",
      email: "usera@example.com",
      groupSize: 1
    }
  });
  const overpayWebhook = await callWorker("/api/payment/webhook", {
    method: "POST",
    env,
    headers: { "x-webhook-secret": env.PAYMENT_WEBHOOK_SECRET },
    body: {
      id: "TXN-OVER-1",
      content: `Thanh toan ${bookOverCode}`,
      transferAmount: recOver.data.expectedAmount + 250000
    }
  });
  assert.equal(overpayWebhook.status, 200);
  assert.equal(overpayWebhook.data.status, "PAID");
  assert.equal(overpayWebhook.data.isOverpaid, true);
  assert.equal(overpayWebhook.data.overpaidAmount, 250000);
});
