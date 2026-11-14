import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import workerV42, {
  V41_ROUTE_REGISTRY,
  V42_ROUTE_REGISTRY
} from "../src/index.js";
import { initFrontendAppV4 } from "../frontend/core/bootstrapV4.js";
import {
  validateFrontendEnvironment,
  assertStagingNotConnectedToProduction
} from "../frontend/config/environments.js";
import { getSyncStatus } from "../auto-sync-github.js";

function makeDevEnv(overrides = {}) {
  return {
    ENVIRONMENT: "development",
    APP_NAME: "WanderMatch V4.2 Dev Test",
    USE_V4_POSTGRES_RPC: "false",
    SUPABASE_URL: "http://127.0.0.1:54321",
    SESSION_SECRET: "test-v42-session-secret-key",
    PAYMENT_WEBHOOK_SECRET: "test-v42-webhook-secret-key",
    PII_ENCRYPTION_KEY_V1: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    PII_HMAC_KEY: "test-v42-pii-hmac-key",
    ADMIN_EMAILS: "admin-v42@wandermatch.vn",
    ...overrides
  };
}

function makeFakeJwt(payloadObj) {
  const encode = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payloadObj)}.sig`;
}

function signHmacSha256Hex(secret, rawBody) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

test("V4.2 Architecture & Security Suite", async (t) => {
  await t.test("V4.2-01: Route registries preserve 11 V4.1 keys and expose expanded V4.2 routes", () => {
    assert.equal(Object.keys(V41_ROUTE_REGISTRY).length, 11);
    assert.ok(Object.keys(V42_ROUTE_REGISTRY).length >= 23);
    assert.ok("GET /api/v4/discovery/catalog" in V42_ROUTE_REGISTRY);
    assert.ok("POST /api/v4/reviews" in V42_ROUTE_REGISTRY);
    assert.ok("GET /api/v4/notifications" in V42_ROUTE_REGISTRY);
    assert.ok("GET /api/v4/bookings/status" in V42_ROUTE_REGISTRY);
  });

  await t.test("V4.2-02: Environment Isolation Guard fails closed when ENVIRONMENT missing or Prod ref/key used in Staging", async () => {
    const missingEnvRes = await workerV42.fetch(new Request("https://api.test/api/v4/health"), {});
    assert.equal(missingEnvRes.status, 503);
    const missingBody = await missingEnvRes.json();
    assert.equal(missingBody.code, "ENV_ISOLATION_VIOLATION");
    assert.equal(missingBody.reason, "MISSING_OR_INVALID_ENVIRONMENT_IDENTITY");

    const stagingProdUrlRes = await workerV42.fetch(new Request("https://api.test/api/v4/health"), {
      ENVIRONMENT: "staging",
      SUPABASE_URL: "https://iwuehabwpihnpahuhqki.supabase.co"
    });
    assert.equal(stagingProdUrlRes.status, 503);

    const prodRoleJwt = makeFakeJwt({ role: "service_role", ref: "iwuehabwpihnpahuhqki" });
    const stagingProdJwtRes = await workerV42.fetch(new Request("https://api.test/api/v4/health"), {
      ENVIRONMENT: "staging",
      SUPABASE_URL: "https://hpwtdlffidfircparanl.supabase.co",
      SUPABASE_PROJECT_REF: "hpwtdlffidfircparanl",
      SUPABASE_SERVICE_ROLE_KEY: prodRoleJwt
    });
    assert.equal(stagingProdJwtRes.status, 503);
    const jwtBody = await stagingProdJwtRes.json();
    assert.equal(jwtBody.code, "PRODUCTION_KEY_IN_STAGING_BLOCKED");
  });

  await t.test("V4.2-03: Full authenticated V4.2 E2E lifecycle via canonical src/index.js (dynamic date, HMAC webhook, reveal, review, cross-tenant denial)", async () => {
    const env = makeDevEnv();
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const emailA = `traveler.a.${suffix}@wandermatch.test`;
    const emailB = `traveler.b.${suffix}@wandermatch.test`;

    // Health check
    const healthRes = await workerV42.fetch(new Request("https://api.test/api/v4/health"), env);
    assert.equal(healthRes.status, 200);
    assert.ok(healthRes.headers.get("X-Request-Id"));
    const healthJson = await healthRes.json();
    assert.equal(healthJson.status, "HEALTHY");

    // Register User A & User B
    const regARes = await workerV42.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailA, password: "Password123!", name: "Traveler Alpha" })
      }),
      env
    );
    assert.equal(regARes.status, 200);
    const regA = await regARes.json();
    assert.ok(regA.token);
    assert.match(regA.user.id, /^[0-9a-f]{8}-[0-9a-f]{4}-/i);

    const regBRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailB, password: "Password123!", name: "Traveler Beta" })
      }),
      env
    );
    assert.equal(regBRes.status, 200);
    const regB = await regBRes.json();
    assert.ok(regB.token);

    // /api/v4/auth/me
    const meRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/auth/me", {
        headers: { Authorization: `Bearer ${regA.token}` }
      }),
      env
    );
    assert.equal(meRes.status, 200);
    const meJson = await meRes.json();
    assert.equal(meJson.user.email, emailA);

    // Public catalog
    const catRes = await workerV42.fetch(new Request("https://api.test/api/v4/discovery/catalog"), env);
    assert.equal(catRes.status, 200);
    const catJson = await catRes.json();
    assert.ok(Array.isArray(catJson.destinations) && catJson.destinations.length >= 6);

    // Dynamic future departure date recommendation (NOT 2026-11-15)
    const recRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regA.token}`
        },
        body: JSON.stringify({
          originAirport: "SGN",
          budgetPerPersonVnd: 6500000,
          groupSize: 2,
          departureDate: "2027-04-12",
          durationDays: 3
        })
      }),
      env
    );
    assert.equal(recRes.status, 200);
    const recJson = await recRes.json();
    assert.ok(recJson.session_id);
    assert.ok(Array.isArray(recJson.packages) && recJson.packages.length >= 3);
    for (const pkg of recJson.packages) {
      assert.equal("secret_destination_id" in pkg, false);
      assert.equal("secret_hotel_id" in pkg, false);
      assert.equal("secret_flight_id" in pkg, false);
    }

    // Create Booking Hold
    const chosenPkg = recJson.packages[0];
    const bookRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regA.token}`
        },
        body: JSON.stringify({
          packageId: chosenPkg.package_id || chosenPkg.id,
          departureDate: "2027-04-12",
          durationDays: 3,
          travelers: [{ fullName: "Traveler Alpha", isPrimary: true }]
        })
      }),
      env
    );
    assert.equal(bookRes.status, 200);
    const bookJson = await bookRes.json();
    assert.ok(bookJson.booking_code);
    assert.equal(bookJson.status, "PENDING_PAYMENT");

    // Early reveal MUST fail (402 Payment Required / 409 Conflict)
    const earlyRevealRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/bookings/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regA.token}`
        },
        body: JSON.stringify({ bookingCode: bookJson.booking_code })
      }),
      env
    );
    assert.ok([402, 409].includes(earlyRevealRes.status));

    // Forged webhook signature MUST fail (401)
    const webhookPayload = JSON.stringify({
      provider: "SEPAY",
      providerEventId: `evt_${suffix}`,
      externalTransactionId: `tx_${suffix}`,
      bookingCode: bookJson.booking_code,
      transferAmount: Number(bookJson.expected_amount_vnd),
      content: bookJson.booking_code
    });
    const forgedWebhookRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sepay-signature": "0000deadbeef"
        },
        body: webhookPayload
      }),
      env
    );
    assert.equal(forgedWebhookRes.status, 401);

    // Valid HMAC-signed webhook MUST succeed & replay idempotently
    const validSig = signHmacSha256Hex(env.PAYMENT_WEBHOOK_SECRET, webhookPayload);
    const validWebhookRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sepay-signature": validSig
        },
        body: webhookPayload
      }),
      env
    );
    assert.equal(validWebhookRes.status, 200);
    const webhookJson = await validWebhookRes.json();
    assert.equal(webhookJson.status || webhookJson.booking_status, "PAID");

    const replayRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/webhooks/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sepay-signature": validSig
        },
        body: webhookPayload
      }),
      env
    );
    assert.equal(replayRes.status, 200);
    const replayJson = await replayRes.json();
    assert.equal(replayJson.idempotent_replay, true);

    // Cross-tenant access by User B MUST fail with 403
    const crossStatusRes = await workerV42.fetch(
      new Request(`https://api.test/api/v4/bookings/status?bookingCode=${encodeURIComponent(bookJson.booking_code)}`, {
        headers: { Authorization: `Bearer ${regB.token}` }
      }),
      env
    );
    assert.equal(crossStatusRes.status, 403);

    const crossRevealRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/bookings/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regB.token}`
        },
        body: JSON.stringify({ bookingCode: bookJson.booking_code })
      }),
      env
    );
    assert.equal(crossRevealRes.status, 403);

    // Non-admin blocked from admin reconciliation
    const reconForbiddenRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/reconciliation", {
        headers: { Authorization: `Bearer ${regA.token}` }
      }),
      env
    );
    assert.equal(reconForbiddenRes.status, 403);

    // Authorized User A reveal succeeds
    const revealRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/bookings/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regA.token}`
        },
        body: JSON.stringify({ bookingCode: bookJson.booking_code })
      }),
      env
    );
    assert.equal(revealRes.status, 200);
    const revealJson = await revealRes.json();
    assert.ok(revealJson.destination?.city_name || revealJson.reveal?.destination?.city_name);

    // Post-reveal review & public list
    const reviewRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regA.token}`
        },
        body: JSON.stringify({
          bookingCode: bookJson.booking_code,
          rating: 5,
          aiMatchRating: 5,
          reviewText: "V4.2 revealed destination matched every preference accurately!"
        })
      }),
      env
    );
    assert.equal(reviewRes.status, 200);

    // PII upsert + masked lookup
    const piiUpsertRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/pii/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regA.token}`
        },
        body: JSON.stringify({
          cccd: "079200012345",
          refundBankCode: "VCB",
          refundBankAccount: "1029384756",
          refundBankHolder: "TRAVELER ALPHA"
        })
      }),
      env
    );
    assert.equal(piiUpsertRes.status, 200);

    const piiMaskedRes = await workerV42.fetch(
      new Request("https://api.test/api/v4/pii/masked", {
        headers: { Authorization: `Bearer ${regA.token}` }
      }),
      env
    );
    assert.equal(piiMaskedRes.status, 200);
    const piiMasked = await piiMaskedRes.json();
    assert.equal(piiMasked.cccd_masked, "********2345");
    assert.equal(piiMasked.refund_bank_account_masked, "******4756");
  });

  await t.test("V4.2-04: Frontend V4.2 bootstrap wires all 10 domain modules and enforces Staging isolation", () => {
    const store = new Map();
    const fakeStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    };
    const fakeWindow = {
      location: { hostname: "wandermatch-v3-git-feat-v4-architecture-hoinguoitroi.vercel.app", port: "" },
      localStorage: fakeStorage
    };
    const app = initFrontendAppV4(fakeWindow, {
      fetchImpl: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
      storage: fakeStorage
    });

    assert.equal(app.environment, "staging");
    assert.equal(app.core.env.supabaseProjectRef, "hpwtdlffidfircparanl");
    assert.equal(app.core.env.apiBase, "https://wandermatch-api-staging.vannong20182018.workers.dev");
    assert.deepEqual(Object.keys(app.modules).sort(), [
      "admin",
      "ai",
      "auth",
      "blindBooking",
      "booking",
      "discovery",
      "notifications",
      "payment",
      "profile",
      "reviews"
    ]);
    assert.equal(fakeWindow.WM_V4, app);

    const envCheck = validateFrontendEnvironment({
      environment: "staging",
      supabaseProjectRef: "iwuehabwpihnpahuhqki",
      apiBase: "https://wandermatch-api-staging.vannong20182018.workers.dev"
    });
    assert.equal(envCheck.ok, false);
    assert.equal(envCheck.code, "ENV_ISOLATION_VIOLATION");

    assert.throws(
      () => assertStagingNotConnectedToProduction({
        environment: "staging",
        supabaseProjectRef: "iwuehabwpihnpahuhqki",
        apiBase: "https://wandermatch-api-staging.vannong20182018.workers.dev"
      }),
      /ENV_ISOLATION_VIOLATION/
    );

    const syncStat = getSyncStatus();
    assert.equal(typeof syncStat.state, "string");
  });
});
