// ============================================================================
// WANDERMATCH V4.2 — FRONTEND AI RECOMMENDATION CO-PILOT MODULE
// Delegates AI recommendation scoring and sealed bundle generation to Worker V4.
// ============================================================================

export function createAiRecommendationModule({ apiClient }) {
  return {
    buildAiPreferencePayload({
      originAirport = "SGN",
      budgetPerPersonVnd = 5500000,
      groupSize = 2,
      departureDate = "2026-11-15",
      durationDays = 3,
      healing = 80,
      nature = 75,
      solitude = 70,
      comfort = 65,
      culture = 60,
      blacklistedSlugs = [],
      comfortLocks = {}
    } = {}) {
      const budget = Number(budgetPerPersonVnd || 5500000);
      const size = Number(groupSize || 2);
      if (!Number.isFinite(budget) || budget <= 0) {
        throw new Error("VALIDATION_ERROR: budgetPerPersonVnd must be a positive number.");
      }
      if (!Number.isInteger(size) || size < 1 || size > 20) {
        throw new Error("VALIDATION_ERROR: groupSize must be between 1 and 20.");
      }
      return {
        originAirport: String(originAirport || "SGN").toUpperCase(),
        budgetPerPersonVnd: budget,
        groupSize: size,
        departureDate: String(departureDate || "2026-11-15").slice(0, 10),
        durationDays: Number(durationDays || 3),
        userPreferences: {
          healing: Number(healing || 80),
          nature: Number(nature || 75),
          solitude: Number(solitude || 70),
          comfort: Number(comfort || 65),
          culture: Number(culture || 60)
        },
        blacklistedSlugs: Array.isArray(blacklistedSlugs) ? blacklistedSlugs : [],
        comfortLocks: comfortLocks || {}
      };
    },

    async generateRecommendations(input = {}) {
      const payload = this.buildAiPreferencePayload(input);
      return apiClient.post("/api/v4/recommendations", payload, { requireAuth: true });
    },

    explainScore(pkg = {}) {
      const sb = pkg.score_breakdown || {};
      return {
        blindCode: pkg.blind_code_alias || "WM-SEALED",
        totalScore: Number(pkg.total_score ?? sb.sTotal ?? 0),
        vibeMatch: Number(pkg.similarity_score ?? sb.sVibe ?? 0),
        climateLabel: pkg.climate_zone_label || "",
        anonymityPoolSize: Number(pkg.k_anonymity_count || 0)
      };
    }
  };
}
