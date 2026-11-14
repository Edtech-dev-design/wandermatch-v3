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

export function filterCatalogItems(items = [], { query = "", region = "", climate = "", maxBudgetVnd = 0 } = {}) {
  const list = Array.isArray(items) ? items : [];
  const q = String(query || "").trim().toLowerCase();
  const r = String(region || "").trim().toUpperCase();
  const c = String(climate || "").trim().toUpperCase();
  const budgetCap = Number(maxBudgetVnd || 0);

  return list.filter(item => {
    const textBlob = [
      item.city_name,
      item.province_name,
      item.region,
      item.climate_zone_label,
      item.temp_range_label,
      item.archetypeLabel,
      item.vibeSummary
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (q && !textBlob.includes(q)) return false;
    if (r && r !== "ALL" && String(item.region || "").toUpperCase() !== r) return false;
    if (c && c !== "ALL" && !String(item.climate_zone_label || item.climate_bucket_id || "").toUpperCase().includes(c)) {
      return false;
    }
    const price = Number(item.estimatedPriceVnd || item.pricePerPersonVnd || 0);
    if (budgetCap > 0 && price > 0 && price > budgetCap) return false;
    return true;
  });
}

export function createDiscoveryModule({ apiClient }) {
  return {
    buildDiscoveryPayload,
    filterCatalogItems,
    async getCatalog({ query = "", region = "", climate = "", maxBudgetVnd = 0 } = {}) {
      const res = await apiClient.get("/api/v4/discovery/catalog", { requireAuth: false });
      const items = res.destinations || res.items || [];
      return {
        ...res,
        items: filterCatalogItems(items, { query, region, climate, maxBudgetVnd })
      };
    },
    async requestRecommendations(params) {
      const payload = buildDiscoveryPayload(params);
      return apiClient.post("/api/v4/recommendations", payload, { requireAuth: true });
    }
  };
}

