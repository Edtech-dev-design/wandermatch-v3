import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker.js";

const baseEnv = {
  SESSION_SECRET: "test-session-secret",
  PAYMENT_WEBHOOK_SECRET: "test-webhook-secret",
  AI: {
    async run() {
      return {
        response: JSON.stringify({
          archetype: "Nature traveler",
          vibe_match_score: 90,
          psychographic_analysis: "Prefers nature and quiet stays."
        })
      };
    }
  }
};

async function callApi(path, { method = "GET", body, headers = {}, env = baseEnv } = {}) {
  const request = new Request(`http://localhost${path}`, {
    method,
    headers: body === undefined ? headers : { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const response = await worker.fetch(request, env);
  return { response, data: await response.json() };
}

test("recommendation, booking, webhook and persistent-store contracts", async () => {
  const adminBefore = await callApi("/api/admin-summary");
  const initialBookingCount = adminBefore.data.bookings.length;
  const budget = 7000000;

  const recommendation = await callApi("/api/ai-recommend", {
    method: "POST",
    body: {
      originAirport: "SGN",
      budgetVnd: budget,
      groupSize: 2,
      userVector: { healing: 90, nature: 90, solitude: 80, comfort: 85, culture: 75 },
      blacklistCities: []
    }
  });
  assert.equal(recommendation.response.status, 200);
  assert.equal(recommendation.data.success, true);
  assert.ok(recommendation.data.top3Curated.length > 0);
  assert.ok(recommendation.data.top3Curated.every(option => option.costPerPerson <= budget));
  assert.ok(recommendation.data.revealPackage.budgetPaid <= budget * 2);

  const adminAfterRecommendation = await callApi("/api/admin-summary");
  assert.equal(adminAfterRecommendation.data.bookings.length, initialBookingCount);

  const invalidRecommendation = await callApi("/api/ai-recommend", {
    method: "POST",
    body: { originAirport: "SGN", budgetVnd: 100000, groupSize: 1 }
  });
  assert.equal(invalidRecommendation.response.status, 400);
  assert.equal(invalidRecommendation.data.success, false);

  const bookingCode = "WM54321";
  const booking = await callApi("/api/create-booking", {
    method: "POST",
    body: {
      bookingCode,
      originAirport: "SGN",
      preferredCity: "Đà Lạt",
      budgetVnd: budget,
      groupSize: 2,
      userVector: { healing: 90, nature: 90, solitude: 80, comfort: 85, culture: 75 },
      blacklistCities: []
    }
  });
  assert.equal(booking.response.status, 200);
  assert.equal(booking.data.bookingCode, bookingCode);
  assert.equal(booking.data.revealPackage.cityName, "Đà Lạt");
  assert.ok(booking.data.revealPackage.budgetPaid <= budget * 2);
  const adminWithBooking = await callApi("/api/admin-summary");
  assert.equal(adminWithBooking.data.bookings[0].budgetPaid, budget * 2);

  const clientConfirmation = await callApi("/api/payment/confirm-receipt", {
    method: "POST",
    body: { bookingCode, amount: booking.data.revealPackage.budgetPaid }
  });
  assert.equal(clientConfirmation.response.status, 403);

  const statusBeforeWebhook = await callApi(`/api/payment/check-status?bookingCode=${bookingCode}`);
  assert.equal(statusBeforeWebhook.data.isPaid, false);

  const rejectedWebhook = await callApi("/api/payment/webhook", {
    method: "POST",
    body: { content: bookingCode, transferAmount: budget * 2 }
  });
  assert.equal(rejectedWebhook.response.status, 401);

  const webhook = await callApi("/api/payment/webhook", {
    method: "POST",
    headers: { "x-webhook-secret": baseEnv.PAYMENT_WEBHOOK_SECRET },
    body: { content: bookingCode, transferAmount: budget * 2, id: "BANK-TEST-1" }
  });
  assert.equal(webhook.response.status, 200);
  assert.equal(webhook.data.status, "PAID");

  const statusAfterWebhook = await callApi(`/api/payment/check-status?bookingCode=${bookingCode}`);
  assert.equal(statusAfterWebhook.data.isPaid, true);

  const refund = await callApi("/api/simulate-refund", {
    method: "POST",
    body: {
      bookingCode,
      totalPaid: budget * 2,
      scenario: "EARLY_72H",
      action: "EXECUTE_REFUND"
    }
  });
  assert.equal(refund.response.status, 200);
  assert.equal(refund.data.status, "SIMULATED");
  assert.equal(refund.data.isSimulation, true);
  assert.match(refund.data.message, /chưa có khoản tiền nào được chuyển/i);

  const statusAfterRefundSimulation = await callApi(`/api/payment/check-status?bookingCode=${bookingCode}`);
  assert.equal(statusAfterRefundSimulation.data.isPaid, true);

  const originalFetch = globalThis.fetch;
  const supabaseCalls = [];
  globalThis.fetch = async (input, init = {}) => {
    const requestUrl = String(input);
    supabaseCalls.push({ url: requestUrl, method: init.method || "GET", body: init.body });
    if ((init.method || "GET") === "GET") {
      return new Response(JSON.stringify([{
        state: { bookings: [], payments: [], refunds: [], feedback: [], users: {} }
      }]), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(null, { status: 204 });
  };

  try {
    const persistedBooking = await callApi("/api/create-booking", {
      method: "POST",
      env: {
        ...baseEnv,
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key"
      },
      body: { bookingCode: "WM67890", origin: "SGN", budgetVnd: budget, groupSize: 1 }
    });
    assert.equal(persistedBooking.response.status, 200);
    const write = supabaseCalls.find(call => call.method === "PATCH");
    assert.ok(write);
    assert.match(write.url, /wm_worker_state\?singleton=eq\.true$/);
    assert.equal(JSON.parse(write.body).state.bookings[0].bookingCode, "WM67890");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
