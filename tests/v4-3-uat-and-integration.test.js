import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import workerV43, { V41_ROUTE_REGISTRY, V42_ROUTE_REGISTRY } from "../src/index.js";
import { createWorkerApiClient } from "../frontend/services/apiClient.js";
import { initFrontendAppV4 } from "../frontend/core/bootstrapV4.js";
import { filterCatalogItems } from "../frontend/modules/discovery/discoveryModule.js";
import { sealClientDraft, containsForbiddenSecretFields } from "../frontend/modules/blind-booking/blindBookingModule.js";

function makeDevEnv(overrides = {}) {
  return {
    ENVIRONMENT: "development",
    APP_NAME: "WanderMatch V4.3 Dev Test",
    USE_V4_POSTGRES_RPC: "false",
    SUPABASE_URL: "http://127.0.0.1:54321",
    SESSION_SECRET: "test-v43-session-secret-key",
    PAYMENT_WEBHOOK_SECRET: "test-v43-webhook-secret-key",
    PII_ENCRYPTION_KEY_V1: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    PII_HMAC_KEY: "test-v43-pii-hmac-key",
    ADMIN_EMAILS: "admin@wandermatch.vn",
    ...overrides
  };
}

test("V4.3 Integration & UAT Hardening Suite", async (t) => {
  await t.test("V4.3-01: Router exposes V4.3 forgot/reset password, profile update, and user bookings list", () => {
    assert.equal(Object.keys(V41_ROUTE_REGISTRY).length, 11);
    assert.ok("POST /api/v4/auth/forgot-password" in V42_ROUTE_REGISTRY);
    assert.ok("POST /api/v4/auth/reset-password" in V42_ROUTE_REGISTRY);
    assert.ok("PUT /api/v4/users/profile" in V42_ROUTE_REGISTRY);
    assert.ok("POST /api/v4/users/profile" in V42_ROUTE_REGISTRY);
    assert.ok("GET /api/v4/bookings" in V42_ROUTE_REGISTRY);
  });

  await t.test("V4.3-02: Profile update, bookings list, and password reset flow end-to-end", async () => {
    const env = makeDevEnv();
    const email = `v43.user.${Date.now()}@wandermatch.test`;

    const regRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "Password123!", name: "V43 Tester" })
      }),
      env
    );
    assert.equal(regRes.status, 200);
    const { token } = await regRes.json();
    assert.ok(token);

    // Update profile & preferences
    const putProfileRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: "V43 Updated Traveler",
          phone: "0909123456",
          originAirport: "HAN",
          budgetPerPersonVnd: 7200000,
          blacklistedSlugs: ["nha-trang"]
        })
      }),
      env
    );
    assert.equal(putProfileRes.status, 200);
    const putJson = await putProfileRes.json();
    assert.equal(putJson.profile.full_name, "V43 Updated Traveler");
    assert.equal(putJson.profile.phone, "0909123456");
    assert.equal(putJson.profile.preferences.comfort_locks.origin_airport, "HAN");
    assert.equal(putJson.profile.preferences.comfort_locks.budget_per_person_vnd, 7200000);

    // Validation error on short fullName
    const badProfileRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: "A" })
      }),
      env
    );
    assert.equal(badProfileRes.status, 400);

    // List user's bookings (empty initially, then populated cleanly without secrets)
    const listRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      env
    );
    assert.equal(listRes.status, 200);
    const listJson = await listRes.json();
    assert.ok(Array.isArray(listJson.items));

    // Forgot + Reset password flow
    const forgotRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }),
      env
    );
    assert.equal(forgotRes.status, 200);

    const badResetRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: "000000", newPassword: "NewPassword123!" })
      }),
      env
    );
    assert.equal(badResetRes.status, 401);

    // Reset using signed recovery bearer token (zero backdoor)
    const validResetRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryToken: token, newPassword: "NewPassword123!" })
      }),
      env
    );
    assert.equal(validResetRes.status, 200);

    // Login with new password succeeds
    const reloginRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "NewPassword123!" })
      }),
      env
    );
    assert.equal(reloginRes.status, 200);
  });

  await t.test("V4.3-03: Frontend apiClient timeout/401 normalization, blind sealing, and discovery filter", async () => {
    let unauthorizedTriggered = false;
    const apiClient = createWorkerApiClient({
      envConfig: {
        environment: "staging",
        supabaseUrl: "https://hpwtdlffidfircparanl.supabase.co",
        supabaseProjectRef: "hpwtdlffidfircparanl",
        apiBase: "https://wandermatch-api-staging.vannong20182018.workers.dev"
      },
      getAccessToken: () => "fake.jwt.token",
      onUnauthorized: () => {
        unauthorizedTriggered = true;
      },
      fetchImpl: async (url, init) => {
        if (url.includes("/slow")) {
          return new Promise((_, reject) => {
            init.signal?.addEventListener("abort", () => {
              const abortErr = new Error("Aborted");
              abortErr.name = "AbortError";
              reject(abortErr);
            });
          });
        }
        return new Response(JSON.stringify({ error: "Expired JWT" }), { status: 401 });
      }
    });

    await assert.rejects(() => apiClient.get("/api/v4/auth/me"), (err) => err.status === 401);
    assert.equal(unauthorizedTriggered, true);

    await assert.rejects(
      () => apiClient.get("/api/v4/slow", { timeoutMs: 25 }),
      (err) => err.status === 504 && err.code === "REQUEST_TIMEOUT"
    );

    const leakedDraft = {
      is_revealed: false,
      secret_hotel_id: "h-1",
      cityName: "Dalat",
      reveal: { city: "Dalat", hotel: "Secret Villa", flightCode: "VN123" }
    };
    assert.equal(containsForbiddenSecretFields(leakedDraft), true);
    const sealed = sealClientDraft(leakedDraft);
    assert.equal(containsForbiddenSecretFields(sealed), false);
    assert.equal(sealed.reveal.city, null);
    assert.equal(sealed.reveal.hotel, null);

    const filtered = filterCatalogItems(
      [
        { city_name: "Đà Lạt", climate_zone_label: "Mát mẻ cao nguyên", region: "CENTRAL_HIGHLANDS", estimatedPriceVnd: 4200000 },
        { city_name: "Phú Quốc", climate_zone_label: "Biển đảo nhiệt đới", region: "SOUTH", estimatedPriceVnd: 8900000 }
      ],
      { query: "cao nguyên", maxBudgetVnd: 5000000 }
    );
    assert.equal(filtered.length, 1);

    const app = initFrontendAppV4({ location: { hostname: "localhost", port: "3000" } });
    assert.equal(app.version, "4.3.0");
  });

  await t.test("V4.3.2-01: Payment & Webhook hardening rejects missing tx/amount, conflicting memo, expired timestamp & unmatched code", async () => {
    const env = makeDevEnv();
    const email = `v432.pay.${Date.now()}@wandermatch.test`;
    const signHmac = (raw) => crypto.createHmac("sha256", env.PAYMENT_WEBHOOK_SECRET).update(raw).digest("hex");

    const regRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "Password123!", name: "Payment Tester" })
      }),
      env
    );
    const { token } = await regRes.json();

    const recRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ originAirport: "SGN", budgetPerPersonVnd: 6500000, groupSize: 2, departureDate: "2027-06-15", durationDays: 3 })
      }),
      env
    );
    assert.equal(recRes.status, 200);
    const recJson = await recRes.json();
    const pkgId = recJson.packages[0].package_id || recJson.packages[0].id;

    const bookRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packageId: pkgId, departureDate: "2027-06-15", durationDays: 3, travelers: [{ fullName: "Payment Tester" }] })
      }),
      env
    );
    assert.equal(bookRes.status, 200);
    const bookJson = await bookRes.json();

    // 1. Missing externalTransactionId -> 400
    const rawMissingTx = JSON.stringify({ bookingCode: bookJson.booking_code, transferAmount: bookJson.expected_amount_vnd });
    const missingTxRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sepay-signature": signHmac(rawMissingTx) },
        body: rawMissingTx
      }),
      env
    );
    assert.equal(missingTxRes.status, 400);

    // 2. Non-positive amount -> 400
    const rawZeroAmt = JSON.stringify({ externalTransactionId: "tx_zero", bookingCode: bookJson.booking_code, transferAmount: 0 });
    const zeroAmtRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sepay-signature": signHmac(rawZeroAmt) },
        body: rawZeroAmt
      }),
      env
    );
    assert.equal(zeroAmtRes.status, 400);

    // 3. Unmatched bookingCode -> 404 (not 200)
    const rawUnmatched = JSON.stringify({ externalTransactionId: "tx_unmatched", bookingCode: "WM20999999", transferAmount: 5000000 });
    const unmatchedRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sepay-signature": signHmac(rawUnmatched) },
        body: rawUnmatched
      }),
      env
    );
    assert.equal(unmatchedRes.status, 404);

    // 4. Conflicting bookingCode vs transferContent memo -> 404 and booking stays PENDING_PAYMENT
    const rawConflict = JSON.stringify({
      externalTransactionId: "tx_conflict_memo",
      bookingCode: bookJson.booking_code,
      transferAmount: bookJson.expected_amount_vnd,
      content: "Thanh toan WM20999999"
    });
    const conflictRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sepay-signature": signHmac(rawConflict) },
        body: rawConflict
      }),
      env
    );
    assert.equal(conflictRes.status, 404);

    const statusBefore = await workerV43.fetch(
      new Request(`https://api.test/api/v4/bookings/status?bookingCode=${encodeURIComponent(bookJson.booking_code)}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      env
    );
    assert.equal((await statusBefore.json()).booking.status, "PENDING_PAYMENT");

    // 5. Expired webhook timestamp (> 5m old) -> 401
    const oldTs = String(Date.now() - 10 * 60 * 1000);
    const rawValidBody = JSON.stringify({
      externalTransactionId: `tx_ts_ok_${Date.now()}`,
      bookingCode: bookJson.booking_code,
      transferAmount: bookJson.expected_amount_vnd,
      content: `Thanh toan ${bookJson.booking_code}`
    });
    const expiredTsRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-timestamp": oldTs,
          "x-sepay-signature": signHmac(`${oldTs}.${rawValidBody}`)
        },
        body: rawValidBody
      }),
      env
    );
    assert.equal(expiredTsRes.status, 401);

    // 6. Fresh timestamp + valid HMAC -> 200 PAID
    const freshTs = String(Date.now());
    const validTsRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-timestamp": freshTs,
          "x-sepay-signature": signHmac(`${freshTs}.${rawValidBody}`)
        },
        body: rawValidBody
      }),
      env
    );
    assert.equal(validTsRes.status, 200);
    assert.equal((await validTsRes.json()).status, "PAID");
  });

  await t.test("V4.3.2-02: Strict JSON parsing, 413 payload size limit, and UUID/range validation", async () => {
    const env = makeDevEnv();
    const email = `v432.val.${Date.now()}@wandermatch.test`;
    const regRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "Password123!", name: "Val Tester" })
      }),
      env
    );
    const { token } = await regRes.json();

    // Malformed JSON -> 400 INVALID_JSON
    const badJsonRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: "{broken_json"
      }),
      env
    );
    assert.equal(badJsonRes.status, 400);
    assert.equal((await badJsonRes.json()).code, "INVALID_JSON");

    // Oversized body (> 256 KB) -> 413 PAYLOAD_TOO_LARGE
    const largePadding = "x".repeat(270000);
    const bigBody = JSON.stringify({ padding: largePadding });
    const bigRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "content-length": String(bigBody.length),
          Authorization: `Bearer ${token}`
        },
        body: bigBody
      }),
      env
    );
    assert.equal(bigRes.status, 413);
    assert.equal((await bigRes.json()).code, "PAYLOAD_TOO_LARGE");

    // Non-UUID V3 packageId -> 400 INVALID_PACKAGE_ID
    const v3PkgRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packageId: "PKG-V3-LEGACY", departureDate: "2027-06-15", durationDays: 3 })
      }),
      env
    );
    assert.equal(v3PkgRes.status, 400);
    assert.equal((await v3PkgRes.json()).code, "INVALID_PACKAGE_ID");

    // Out-of-range recommendation budget & groupSize -> 400
    const badBudgetRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ budgetPerPersonVnd: 100, groupSize: 2 })
      }),
      env
    );
    assert.equal(badBudgetRes.status, 400);

    const badGroupRes = await workerV43.fetch(
      new Request("https://api.test/api/v4/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ budgetPerPersonVnd: 5500000, groupSize: 0 })
      }),
      env
    );
    assert.equal(badGroupRes.status, 400);
  });

  await t.test("V4.3.2-03: Admin summary RBAC (401/403/200) and refund approve decision validation", async () => {
    const env = makeDevEnv();
    const custEmail = `v432.cust.${Date.now()}@wandermatch.test`;

    const custReg = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: custEmail, password: "Password123!", name: "Customer" })
      }),
      env
    );
    const { token: custToken } = await custReg.json();

    const adminReg = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@wandermatch.vn", password: "AdminPassword123!", name: "Admin" })
      }),
      env
    );
    const { token: adminToken } = await adminReg.json();

    const unauthSummary = await workerV43.fetch(new Request("https://api.test/api/v4/admin/summary"), env);
    assert.equal(unauthSummary.status, 401);

    const custSummary = await workerV43.fetch(
      new Request("https://api.test/api/v4/admin/summary", {
        headers: { Authorization: `Bearer ${custToken}` }
      }),
      env
    );
    assert.equal(custSummary.status, 403);

    const adminSummary = await workerV43.fetch(
      new Request("https://api.test/api/v4/admin/summary", {
        headers: { Authorization: `Bearer ${adminToken}` }
      }),
      env
    );
    assert.equal(adminSummary.status, 200);
    const sumJson = await adminSummary.json();
    assert.equal(typeof sumJson.summary.totalBookings, "number");
    assert.ok(Array.isArray(sumJson.recentBookings));

    const badApprove = await workerV43.fetch(
      new Request("https://api.test/api/v4/refunds/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ refundId: "00000000-0000-4000-8000-000000000099", decision: "MAYBE" })
      }),
      env
    );
    assert.equal(badApprove.status, 400);
  });

  await t.test("V4.3.2-04: AI recommendation 10-persona matrix enforces schema, k-anonymity & zero pre-reveal leak", async () => {
    const env = makeDevEnv();
    const email = `v432.ai.${Date.now()}@wandermatch.test`;
    const reg = await workerV43.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "Password123!", name: "Persona Tester" })
      }),
      env
    );
    const { token } = await reg.json();

    const personas = [
      { label: "low_budget", body: { originAirport: "SGN", budgetPerPersonVnd: 4200000, groupSize: 2, departureDate: "2027-07-01" }, expectStatus: 200 },
      { label: "high_budget", body: { originAirport: "HAN", budgetPerPersonVnd: 18000000, groupSize: 2, departureDate: "2027-07-02" }, expectStatus: 200 },
      { label: "family", body: { originAirport: "SGN", budgetPerPersonVnd: 7500000, groupSize: 4, departureDate: "2027-07-03" }, expectStatus: 200 },
      { label: "solo", body: { originAirport: "SGN", budgetPerPersonVnd: 6500000, groupSize: 1, departureDate: "2027-07-04" }, expectStatus: 200 },
      { label: "couple", body: { originAirport: "HAN", budgetPerPersonVnd: 8000000, groupSize: 2, departureDate: "2027-07-05" }, expectStatus: 200 },
      { label: "nature_lover", body: { originAirport: "SGN", budgetPerPersonVnd: 6800000, groupSize: 2, userPreferences: { healing: 90, nature: 99, solitude: 85, comfort: 70, culture: 60 } }, expectStatus: 200 },
      { label: "culture_lover", body: { originAirport: "HAN", budgetPerPersonVnd: 6800000, groupSize: 2, userPreferences: { healing: 70, nature: 65, solitude: 60, comfort: 75, culture: 99 } }, expectStatus: 200 },
      { label: "luxury_retreat", body: { originAirport: "SGN", budgetPerPersonVnd: 12000000, groupSize: 2, userPreferences: { healing: 95, nature: 80, solitude: 90, comfort: 99, culture: 70 } }, expectStatus: 200 },
      { label: "minimal_defaults", body: {}, expectStatus: 200 },
      { label: "invalid_negative_budget", body: { budgetPerPersonVnd: -500 }, expectStatus: 400 }
    ];

    for (const p of personas) {
      const r = await workerV43.fetch(
        new Request("https://api.test/api/v4/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(p.body)
        }),
        env
      );
      assert.equal(r.status, p.expectStatus, `Persona ${p.label} expected ${p.expectStatus}, got ${r.status}`);
      if (p.expectStatus === 200) {
        const json = await r.json();
        assert.ok(json.session_id, `Missing session_id for ${p.label}`);
        assert.ok(Array.isArray(json.packages) && json.packages.length >= 3, `Expected >= 3 packages for ${p.label}`);
        for (const pkg of json.packages) {
          assert.match(pkg.package_id || pkg.id, /^[0-9a-f-]{36}$/i);
          assert.ok(Number(pkg.k_anonymity_count) >= 3);
          assert.equal(containsForbiddenSecretFields(pkg), false, `Secret leaked in ${p.label}`);
        }
      }
    }
  });
});
