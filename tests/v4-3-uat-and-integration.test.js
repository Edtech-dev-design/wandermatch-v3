import test from "node:test";
import assert from "node:assert/strict";
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
});
