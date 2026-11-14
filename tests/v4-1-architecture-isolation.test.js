// ============================================================================
// WANDERMATCH V4.1 — ARCHITECTURE, ENVIRONMENT ISOLATION & AI RESILIENCE TESTS
// Verifies:
// 1. Frontend V4.1 Modular Architecture (config, core, services, 7 domain modules)
// 2. Backend V4.1 Modular Architecture (src/index.js, router, middleware, controllers)
// 3. Hard Staging-to-Production Isolation Guard (blocks iwuehabwpihnpahuhqki)
// 4. AI Co-Pilot DNS/Upstream Failure Resilience (lookup daily-cloudcode-pa.googleapis.com)
// ============================================================================

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import worker, {
  enforceEnvironmentIsolation,
  PRODUCTION_SUPABASE_PROJECT_REF,
  STAGING_SUPABASE_PROJECT_REF,
  redactSecrets,
  executeResilientDualAICoPilot,
  V41_ROUTE_REGISTRY
} from "../src/index.js";

import {
  resolveFrontendEnvironment,
  assertStagingNotConnectedToProduction
} from "../frontend/config/environments.js";
import { createFrontendCore } from "../frontend/core/appCore.js";
import { createWorkerApiClient } from "../frontend/services/apiClient.js";
import { createAuthModule } from "../frontend/modules/auth/authModule.js";
import { createDiscoveryModule } from "../frontend/modules/discovery/discoveryModule.js";
import { createBlindBookingModule } from "../frontend/modules/blind-booking/blindBookingModule.js";
import { createBookingModule } from "../frontend/modules/booking/bookingModule.js";
import { createPaymentModule } from "../frontend/modules/payment/paymentModule.js";
import { createProfileModule } from "../frontend/modules/profile/profileModule.js";
import { createAdminModule } from "../frontend/modules/admin/adminModule.js";

describe("WanderMatch V4.1 — Architecture Restructuring, Environment Isolation & AI Resilience", () => {
  it("V4.1-01: Blocks Staging Worker from ever connecting to Production Supabase (iwuehabwpihnpahuhqki)", async () => {
    const misconfiguredStagingEnv = {
      ENVIRONMENT: "staging",
      USE_V4_POSTGRES_RPC: "true",
      SUPABASE_URL: `https://${PRODUCTION_SUPABASE_PROJECT_REF}.supabase.co`,
      SUPABASE_SERVICE_ROLE_KEY: "test-key",
      SESSION_SECRET: "staging-session-secret"
    };

    const req = new Request("https://wandermatch-api-staging.vannong20182018.workers.dev/api/health");
    const res = await worker.fetch(req, misconfiguredStagingEnv);
    assert.equal(res.status, 503, "Staging Worker connected to Production Supabase URL must immediately return 503");
    const body = await res.json();
    assert.equal(body.code, "ENV_ISOLATION_VIOLATION");
    assert.ok(res.headers.get("x-request-id"), "Response must include X-Request-Id header");
  });

  it("V4.1-02: Blocks Production Service Role Key JWT inside Staging Worker", () => {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ role: "service_role", ref: PRODUCTION_SUPABASE_PROJECT_REF })).toString("base64url");
    const fakeProdServiceRoleJwt = `${header}.${payload}.fakesig`;

    assert.throws(
      () =>
        enforceEnvironmentIsolation({
          ENVIRONMENT: "staging",
          SUPABASE_URL: `https://${STAGING_SUPABASE_PROJECT_REF}.supabase.co`,
          SUPABASE_SERVICE_ROLE_KEY: fakeProdServiceRoleJwt
        }),
      (err) => err.code === "PRODUCTION_KEY_IN_STAGING_BLOCKED" && err.httpStatus === 503
    );
  });

  it("V4.1-03: Verifies Frontend V4.1 Environment Isolation & Modular Architecture", async () => {
    const stagingEnv = resolveFrontendEnvironment("wandermatch-v4.vercel.app");
    assert.equal(stagingEnv.name, "staging");
    assert.equal(stagingEnv.supabaseProjectRef, STAGING_SUPABASE_PROJECT_REF);
    assert.equal(stagingEnv.apiBase, "https://wandermatch-api-staging.vannong20182018.workers.dev");
    assert.equal(assertStagingNotConnectedToProduction(stagingEnv), true);

    assert.throws(
      () =>
        assertStagingNotConnectedToProduction({
          name: "staging",
          supabaseUrl: `https://${PRODUCTION_SUPABASE_PROJECT_REF}.supabase.co`,
          apiBase: "https://wandermatch-api-staging.vannong20182018.workers.dev"
        }),
      /ENV_ISOLATION_VIOLATION/
    );

    const core = createFrontendCore({ location: { hostname: "staging.wandermatch.vn", port: "" } });
    assert.equal(core.version, "4.1.0");
    assert.equal(core.env.name, "staging");

    const apiClient = createWorkerApiClient({
      envConfig: stagingEnv,
      getAccessToken: async () => "test-token",
      fetchImpl: async (url, opts) => {
        return new Response(JSON.stringify({ success: true, url, requestId: opts.headers["X-Request-Id"] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    });

    const authMod = createAuthModule({ apiClient, storage: null });
    const discMod = createDiscoveryModule({ apiClient });
    const blindMod = createBlindBookingModule({ apiClient });
    const bookMod = createBookingModule({ apiClient });
    const payMod = createPaymentModule({ apiClient });
    const profMod = createProfileModule({ apiClient });
    const adminMod = createAdminModule({ apiClient });

    assert.equal(typeof authMod.login, "function");
    assert.equal(typeof discMod.requestRecommendations, "function");
    assert.equal(typeof blindMod.revealBlindBooking, "function");
    assert.equal(typeof bookMod.createBookingWithHold, "function");
    assert.equal(typeof payMod.requestRefund, "function");
    assert.equal(typeof profMod.getMyMaskedPii, "function");
    assert.equal(typeof adminMod.runReconciliationChecks, "function");
    assert.equal(Object.keys(V41_ROUTE_REGISTRY).length, 11);
  });

  it("V4.1-04: Handles AI Upstream DNS failure (lookup daily-cloudcode-pa.googleapis.com: no such host) with honest fallback", async () => {
    const pkgRecord = {
      weatherTempC: 18,
      weatherDesc: "Se lạnh, sương mù nhẹ",
      secretRevealPackage: {
        cityName: "Đà Lạt",
        hotelName: "Ana Mandara Villas Dalat Resort & Spa"
      }
    };

    const failingAiEnv = {
      AI: {
        async run() {
          throw new Error("lookup daily-cloudcode-pa.googleapis.com: no such host");
        }
      }
    };

    const res = await executeResilientDualAICoPilot(pkgRecord, { budgetVnd: 5000000, groupSize: 2 }, failingAiEnv);
    assert.equal(res.aiStatus, "DETERMINISTIC_FALLBACK");
    assert.equal(res.aiFallbackUsed, true);
    assert.equal(res.tasteProfile.source, "DETERMINISTIC_FALLBACK");
    assert.equal(res.mysteryCuration.source, "DETERMINISTIC_FALLBACK");
    assert.ok(!res.dualEngine.includes("(Live)"), "Fallback mode must never claim live AI model execution");
    assert.ok(res.diagnostics.errors.some(e => e.includes("daily-cloudcode-pa.googleapis.com")));

    // Secret redaction check
    const redacted = redactSecrets({
      Authorization: "Bearer secret_jwt_token_123",
      SUPABASE_SERVICE_ROLE_KEY: "super_secret_service_role",
      normalField: "safe"
    });
    assert.equal(redacted.Authorization, "[REDACTED]");
    assert.equal(redacted.SUPABASE_SERVICE_ROLE_KEY, "[REDACTED]");
    assert.equal(redacted.normalField, "safe");
  });
});
