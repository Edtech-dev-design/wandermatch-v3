// ============================================================================
// WANDERMATCH V4.2 — FRONTEND MODULAR BOOTSTRAP (frontend/core/bootstrapV4.js)
// Initializes all 10 domain modules genuinely onto window.WM_V4 so legacy UI
// handlers and modern V4 components share one validated environment & client.
// ============================================================================

import { createFrontendCore } from "./appCore.js";
import { createWorkerApiClient } from "../services/apiClient.js";
import { createAuthModule } from "../modules/auth/authModule.js";
import { createProfileModule } from "../modules/profile/profileModule.js";
import { createDiscoveryModule } from "../modules/discovery/discoveryModule.js";
import { createAiRecommendationModule } from "../modules/ai/aiRecommendationModule.js";
import { createBlindBookingModule } from "../modules/blind-booking/blindBookingModule.js";
import { createBookingModule } from "../modules/booking/bookingModule.js";
import { createPaymentModule } from "../modules/payment/paymentModule.js";
import { createReviewsModule } from "../modules/reviews/reviewsModule.js";
import { createNotificationsModule } from "../modules/notifications/notificationsModule.js";
import { createAdminModule } from "../modules/admin/adminModule.js";

export function readActiveAccessToken(storage) {
  try {
    const legacyRaw = storage?.getItem?.("wm_session_prod");
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy?.token && legacy.token !== "local-token") return legacy.token;
    }
    const sbRaw = storage?.getItem?.("wm_supabase_session");
    if (sbRaw) {
      const sb = JSON.parse(sbRaw);
      if (sb?.access_token) return sb.access_token;
    }
  } catch (_) {}
  return null;
}

export function initFrontendAppV4(
  customWindow = typeof window !== "undefined" ? window : null,
  { fetchImpl = globalThis.fetch, storage = customWindow?.localStorage || null } = {}
) {
  const core = createFrontendCore(customWindow);
  const apiClient = createWorkerApiClient({
    envConfig: core.env,
    getAccessToken: () => readActiveAccessToken(storage),
    fetchImpl,
    onUnauthorized: () => {
      try {
        storage?.removeItem?.("wm_supabase_session");
        core.emit("auth:session-expired", {});
      } catch (_) {}
    }
  });

  const modules = Object.freeze({
    auth: createAuthModule({ apiClient, storage }),
    profile: createProfileModule({ apiClient }),
    discovery: createDiscoveryModule({ apiClient }),
    ai: createAiRecommendationModule({ apiClient }),
    blindBooking: createBlindBookingModule({ apiClient }),
    booking: createBookingModule({ apiClient }),
    payment: createPaymentModule({ apiClient }),
    reviews: createReviewsModule({ apiClient }),
    notifications: createNotificationsModule({ apiClient }),
    admin: createAdminModule({ apiClient })
  });

  const wmV4 = {
    version: "4.3.0",
    environment: core.env.environment || core.env.name,
    core,
    apiClient,
    modules,
    session: {
      getToken: () => readActiveAccessToken(storage),
      getUser: () => modules.auth.getSavedSession()?.user || null
    },
    syncSessionToken(session) {
      try {
        if (session && session.token && session.token !== "local-token") {
          storage?.setItem?.(
            "wm_supabase_session",
            JSON.stringify({ access_token: session.token, user: session })
          );
          core.emit("auth:session-updated", { email: session.email || null });
        } else {
          storage?.removeItem?.("wm_supabase_session");
          core.emit("auth:session-cleared", {});
        }
      } catch (_) {}
    }
  };

  if (customWindow) {
    customWindow.WM_V4 = wmV4;
    if (!customWindow.WM_ENV_CONFIG) {
      customWindow.WM_ENV_CONFIG = core.env;
    }
  }

  return wmV4;
}

if (typeof window !== "undefined") {
  try {
    initFrontendAppV4(window);
  } catch (err) {
    console.error("[WanderMatch V4.2] Frontend bootstrap blocked:", err?.message || err);
  }
}
