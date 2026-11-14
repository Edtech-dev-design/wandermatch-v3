// ============================================================================
// WANDERMATCH V4.1 — FRONTEND DISCOVERY MODULE
// Validates preference vectors, origin airports, group sizes & blacklists
// ============================================================================

export const SUPPORTED_ORIGIN_AIRPORTS = Object.freeze(["SGN", "HAN", "DAD", "VCA", "HPH"]);

export function buildDiscoveryPayload({
  originAirport = "SGN",
  budgetPerPersonVnd = 5500000,
  groupSize = 2,
  departureDate = "2026-11-15",
  durationDays = 3,
  userPreferences = {},
  blacklistedSlugs = [],
  comfortLocks = {}
} = {}) {
  const normalizedOrigin = String(originAirport || "SGN").trim().toUpperCase();
  if (!SUPPORTED_ORIGIN_AIRPORTS.includes(normalizedOrigin)) {
    throw new Error(`Unsupported origin airport: ${normalizedOrigin}`);
  }
  const budget = Number(budgetPerPersonVnd);
  if (!Number.isFinite(budget) || budget <= 0) {
    throw new Error("Budget per person must be a positive number.");
  }
  const size = Number(groupSize);
  if (!Number.isInteger(size) || size < 1 || size > 10) {
    throw new Error("Group size must be an integer between 1 and 10.");
  }

  return {
    originAirport: normalizedOrigin,
    budgetPerPersonVnd: budget,
    groupSize: size,
    departureDate,
    durationDays: Number(durationDays || 3),
    userPreferences: {
      healing: Number(userPreferences.healing ?? 85),
      nature: Number(userPreferences.nature ?? 85),
      solitude: Number(userPreferences.solitude ?? 80),
      comfort: Number(userPreferences.comfort ?? 85),
      culture: Number(userPreferences.culture ?? 75)
    },
    blacklistedSlugs: Array.isArray(blacklistedSlugs) ? blacklistedSlugs : [],
    comfortLocks: comfortLocks || {}
  };
}

export function createDiscoveryModule({ apiClient }) {
  return {
    buildDiscoveryPayload,
    async requestRecommendations(params) {
      const payload = buildDiscoveryPayload(params);
      return apiClient.post("/api/v4/recommendations", payload, { requireAuth: true });
    }
  };
}

