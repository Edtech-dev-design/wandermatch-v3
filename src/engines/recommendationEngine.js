// ============================================================================
// WANDERMATCH V4.0 – 5-STAGE AI RECOMMENDATION & K-ANONYMITY (k >= 3) ENGINE
// Implements:
// - Hard Budget Constraint (P_{c,person} <= B_{person})
// - Flat Tiered Blind Pricing (500,000 VND increments to prevent price side-channels)
// - Normalized 5-Factor Scoring in [0, 100] with explicit B_flight(f)
// - Mandatory MMR Diversity (lambda = 0.80, distinct destinations)
// - k-Anonymity (k >= 3) Equivalence Class Verification & 3-Level Lattice Generalization
// - Dual-Layer Unicode NFD Anti-Leak Gatekeeper
// ============================================================================

const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, Number(val) || 0));

const FORBIDDEN_PROPER_NOUNS = [
  "da lat", "dalat", "lam dong", "langbiang", "xuan huong", "yersin",
  "mang den", "kon tum", "pleiku", "dak ke", "pa sy",
  "sa pa", "sapa", "lao cai", "fansipan",
  "phu quoc", "kien giang", "bai truong", "ham ninh", "duong dong",
  "quy nhon", "binh dinh", "ky co", "eo gio", "phu cat",
  "nha trang", "khanh hoa", "cam ranh", "vinpearl",
  "hue", "thua thien", "song huong", "kinh thanh",
  "da nang", "danang", "hoi an", "my khe", "son tra", "ba na",
  "ninh binh", "trang an", "tam coc", "bai dinh",
  "con dao", "co ong", "hang duong",
  "ana mandara", "salinda", "avani", "pilgrimage", "silk path", "fleur de lys", "grand tourane",
  "vn1", "vn2", "vn3", "vj", "qh", "sla-"
];

export function normalizeNfdAscii(text = "") {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function sanitizePreRevealText(text, fallbackText = "Hành trình nghỉ dưỡng bí mật giữa không gian thiên nhiên tuyển chọn.") {
  const norm = normalizeNfdAscii(text);
  for (const token of FORBIDDEN_PROPER_NOUNS) {
    if (norm.includes(token)) {
      return fallbackText;
    }
  }
  return String(text);
}

/**
 * Stage 1: Preference Vector Normalization (Zero-Vector Safe)
 */
export function normalizePreferenceVector(rawVec = {}, llmDelta = null) {
  const dims = ["healing", "nature", "solitude", "comfort", "culture"];
  let vec = dims.map(k => clamp(rawVec[k] ?? 70, 0, 100));
  const normSq = vec.reduce((acc, v) => acc + v * v, 0);
  if (normSq === 0) {
    vec = [70, 70, 70, 70, 70];
  }
  if (llmDelta && typeof llmDelta === "object") {
    vec = vec.map((v, idx) => {
      const dKey = dims[idx];
      const delta = clamp(llmDelta[dKey] ?? 0, -15, 15);
      return clamp(v + delta, 0, 100);
    });
  }
  const finalNorm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
  if (finalNorm === 0) {
    vec = [70, 70, 70, 70, 70];
  }
  return {
    healing: vec[0],
    nature: vec[1],
    solitude: vec[2],
    comfort: vec[3],
    culture: vec[4],
    array: vec
  };
}

/**
 * Flat Tiered Blind Pricing:
 * Quantizes per-person price into standard 500,000 VND tiers so multiple destinations
 * share the exact same unit_price_vnd and expected_amount_vnd on VietQR!
 */
export function computeFlatTieredUnitPrice(netCostPerPersonVnd, budgetPerPersonVnd) {
  const targetWithMargin = Math.ceil((netCostPerPersonVnd * 1.15) / 500000) * 500000;
  // Standardize to the highest 500k tier <= budgetPerPersonVnd that covers netCost * 1.10,
  // or targetWithMargin if within budget
  const budgetTier = Math.floor(budgetPerPersonVnd / 500000) * 500000;
  const preferredTier = Math.min(budgetTier, Math.max(targetWithMargin, budgetTier - 500000));
  if (preferredTier >= netCostPerPersonVnd && preferredTier <= budgetPerPersonVnd) {
    return preferredTier;
  }
  return targetWithMargin;
}

export function formatDisplayPriceBand(unitPriceVnd) {
  const low = Math.floor(unitPriceVnd / 500000) * 500000;
  const high = low + 500000;
  return `${low.toLocaleString("vi-VN")}đ - ${high.toLocaleString("vi-VN")}đ`;
}

/**
 * Explicit Flight Quality Bonus B_flight(f) in {0, 5, 10}
 */
export function computeFlightBonus(flight) {
  if (!flight || flight.is_red_eye === true || flight.time_band === "EVENING") {
    return 0;
  }
  if (flight.time_band === "MORNING" || flight.time_band === "MIDDAY") {
    return 10;
  }
  if (flight.time_band === "AFTERNOON") {
    return 5;
  }
  return 0;
}

/**
 * Stage 3: 5-Factor Deterministic Scoring in [0, 100]
 */
export function scoreCandidatePackage({
  userVec,
  destination,
  hotel,
  flight,
  unitPriceVnd,
  retailPerPersonVnd,
  budgetPerPersonVnd,
  departureMonth = 11
}) {
  const u = userVec.array;
  const d = [
    Number(destination.healing_score ?? 80),
    Number(destination.nature_score ?? 80),
    Number(destination.solitude_score ?? 80),
    Number(destination.comfort_score ?? 80),
    Number(destination.culture_score ?? 80)
  ];

  let dot = 0, normU = 0, normD = 0, distSq = 0;
  for (let i = 0; i < 5; i++) {
    dot += u[i] * d[i];
    normU += u[i] * u[i];
    normD += d[i] * d[i];
    distSq += (u[i] - d[i]) ** 2;
  }
  const cosine = (normU > 0 && normD > 0) ? (dot / (Math.sqrt(normU) * Math.sqrt(normD))) : 0.75;
  const euclidSim = 1 - (Math.sqrt(distSq) / (100 * Math.sqrt(5)));
  const sVibe = clamp(100 * (0.70 * cosine + 0.30 * euclidSim), 0, 100);

  // S_budget: Gaussian around 0.90 * B_person (only called for candidates where unitPriceVnd <= budgetPerPersonVnd)
  const diffBudget = unitPriceVnd - 0.90 * budgetPerPersonVnd;
  const sigmaBudget = Math.max(1, 0.20 * budgetPerPersonVnd);
  const sBudget = clamp(100 * Math.exp(-(diffBudget * diffBudget) / (2 * sigmaBudget * sigmaBudget)), 0, 100);

  // S_weather
  const climateProf = destination.climate_profile_jsonb || {};
  const sWeather = clamp(Number(climateProf[String(departureMonth)] ?? climateProf.default ?? 75.0), 0, 100);

  // S_value
  const safeRetail = Math.max(unitPriceVnd, retailPerPersonVnd);
  const sValue = clamp(((safeRetail - unitPriceVnd) / Math.max(1, 0.35 * safeRetail)) * 100, 0, 100);

  // S_quality
  const reviewScore = clamp(Number(hotel.review_score ?? 8.5), 1, 10);
  const bFlight = computeFlightBonus(flight);
  const sQuality = clamp(9.0 * reviewScore + bFlight, 0, 100);

  const sTotal = clamp(
    0.40 * sVibe +
    0.20 * sBudget +
    0.15 * sWeather +
    0.15 * sValue +
    0.10 * sQuality,
    0,
    100
  );

  return {
    sVibe: Number(sVibe.toFixed(2)),
    sBudget: Number(sBudget.toFixed(2)),
    sWeather: Number(sWeather.toFixed(2)),
    sValue: Number(sValue.toFixed(2)),
    sQuality: Number(sQuality.toFixed(2)),
    bFlight,
    sTotal: Number(sTotal.toFixed(2))
  };
}

/**
 * Stage 4B: k-Anonymity (k >= 3) Equivalence Class Verification & 3-Level Lattice Generalization
 * Vector Q(p) = (climate_bucket_id, temp_range_label, flight_time_band, hotel_star_tier, mood_illustration_key, display_price_band_vnd)
 */
export function enforceKAnonymityTuple(candidate, allFeasibleDestinationCandidates, minK = 3) {
  const buildTuple = (c, level) => {
    if (level === 0) {
      return {
        climate_bucket_id: c.climate_bucket_id,
        climate_zone_label: c.climate_zone_label,
        temp_range_label: c.temp_range_label,
        flight_time_band: c.flight_time_band,
        hotel_star_tier: c.hotel_star_tier,
        mood_illustration_key: c.mood_illustration_key,
        display_price_band_vnd: c.display_price_band_vnd
      };
    }
    if (level === 1) {
      // Level 1 Generalization: widen flight_time_band & hotel_star_tier
      return {
        climate_bucket_id: c.climate_bucket_id,
        climate_zone_label: c.climate_zone_label,
        temp_range_label: c.temp_range_label,
        flight_time_band: "DAYTIME_FLEX",
        hotel_star_tier: 4,
        mood_illustration_key: `MOOD_${c.climate_bucket_id}`,
        display_price_band_vnd: c.display_price_band_vnd
      };
    }
    // Level 2 Generalization: widen across climate buckets & price band to 1M VND
    const band1M = Math.floor(c.unit_price_vnd / 1000000) * 1000000;
    return {
      climate_bucket_id: "VIETNAM_CURATED_SANCTUARY",
      climate_zone_label: "Miền Khí Hậu Nghỉ Dưỡng Thanh Bình",
      temp_range_label: "18°C – 28°C",
      flight_time_band: "DAYTIME_FLEX",
      hotel_star_tier: 4,
      mood_illustration_key: "MOOD_SIGNATURE_MYSTERY",
      display_price_band_vnd: `${band1M.toLocaleString("vi-VN")}đ - ${(band1M + 1000000).toLocaleString("vi-VN")}đ`
    };
  };

  for (let level = 0; level <= 2; level++) {
    const targetQ = buildTuple(candidate, level);
    const matchingDestIds = new Set();
    for (const other of allFeasibleDestinationCandidates) {
      const otherQ = buildTuple(other, level);
      const matches =
        otherQ.climate_bucket_id === targetQ.climate_bucket_id &&
        otherQ.temp_range_label === targetQ.temp_range_label &&
        otherQ.flight_time_band === targetQ.flight_time_band &&
        otherQ.hotel_star_tier === targetQ.hotel_star_tier &&
        otherQ.mood_illustration_key === targetQ.mood_illustration_key &&
        otherQ.display_price_band_vnd === targetQ.display_price_band_vnd;
      if (matches) {
        matchingDestIds.add(other.destination.id);
      }
    }
    if (matchingDestIds.size >= minK) {
      return {
        generalizationLevel: level,
        kAnonymityCount: matchingDestIds.size,
        generalizedAttributes: targetQ
      };
    }
  }

  return null; // Level 3: Suppress candidate
}

/**
 * Full 5-Stage Recommendation Pipeline Execution
 */
export function runFiveStageRecommendationPipeline({
  userId,
  originAirport = "SGN",
  budgetPerPersonVnd = 5000000,
  groupSize = 2,
  departureDate = "2026-11-15",
  durationDays = 3,
  userPreferences = {},
  blacklistedSlugs = [],
  comfortLocks = {},
  catalog
}) {
  const normOrigin = String(originAirport || "SGN").toUpperCase();
  const G = Math.max(1, Math.min(20, Number(groupSize) || 1));
  const B_person = Number(budgetPerPersonVnd) || 0;
  if (B_person < 1000000) {
    const err = new Error("INVALID_BUDGET: budget_per_person_vnd must be at least 1,000,000 VND.");
    err.code = "INVALID_BUDGET";
    err.status = 400;
    throw err;
  }

  // Stage 1: Normalize User Preference Vector
  const userVec = normalizePreferenceVector(userPreferences);
  const blacklistSet = new Set((blacklistedSlugs || []).map(s => String(s).toLowerCase()));
  const minStars = Number(comfortLocks.min_stars || 4);
  const noRedEye = comfortLocks.no_red_eye !== false;
  const minBaggageKg = Number(comfortLocks.baggage_kg || 0);
  const nights = Math.max(1, Number(durationDays || 3) - 1);
  const roomsNeeded = Math.max(1, Math.ceil(G / 2));

  // First check how many active destinations have inventory on departureDate (before budget filter)
  const activeDestsWithInventory = new Set();
  let minAvailableUnitPriceVnd = Infinity;

  const destinationRepresentatives = [];

  for (const dest of catalog.destinations) {
    if (!dest.is_active) continue;
    if (blacklistSet.has(String(dest.code_slug).toLowerCase())) continue;

    const destHotels = catalog.hotels.filter(
      h => h.destination_id === dest.id && h.is_active && h.star_rating >= minStars
    );
    const destFlights = catalog.flights.filter(
      f =>
        f.destination_id === dest.id &&
        f.origin_airport === normOrigin &&
        f.is_active &&
        (!noRedEye || !f.is_red_eye) &&
        f.baggage_kg >= minBaggageKg
    );

    let bestForDest = null;

    for (const hotel of destHotels) {
      const hotelInv = catalog.partner_inventories.find(
        inv =>
          inv.item_type === "HOTEL_ROOM" &&
          inv.hotel_id === hotel.id &&
          inv.inventory_date === departureDate &&
          inv.is_active &&
          inv.available_slots >= roomsNeeded
      );
      if (!hotelInv) continue;

      for (const flight of destFlights) {
        const flightInv = catalog.partner_inventories.find(
          inv =>
            inv.item_type === "FLIGHT_SEAT" &&
            inv.flight_id === flight.id &&
            inv.inventory_date === departureDate &&
            inv.is_active &&
            inv.available_slots >= G
        );
        if (!flightInv) continue;

        activeDestsWithInventory.add(dest.id);

        const netTotalVnd =
          hotelInv.net_price_vnd * nights * roomsNeeded +
          flightInv.net_price_vnd * 2 * G;
        const retailTotalVnd =
          hotelInv.retail_price_vnd * nights * roomsNeeded +
          flightInv.retail_price_vnd * 2 * G;

        const netPerPersonVnd = Math.ceil(netTotalVnd / G);
        const unitPriceVnd = computeFlatTieredUnitPrice(netPerPersonVnd, B_person);
        if (unitPriceVnd < minAvailableUnitPriceVnd) {
          minAvailableUnitPriceVnd = unitPriceVnd;
        }

        // STRICT HARD BUDGET CONSTRAINT: P_{c,person} <= B_{person}
        if (unitPriceVnd > B_person) {
          continue;
        }

        const expectedAmountVnd = unitPriceVnd * G;
        const adjustedRetailTotalVnd = Math.max(
          retailTotalVnd,
          Math.ceil((expectedAmountVnd * 1.22) / 100000) * 100000
        );

        const scoreBreakdown = scoreCandidatePackage({
          userVec,
          destination: dest,
          hotel,
          flight,
          unitPriceVnd,
          retailPerPersonVnd: Math.round(adjustedRetailTotalVnd / G),
          budgetPerPersonVnd: B_person
        });

        const candidateObj = {
          destination: dest,
          hotel,
          flight,
          hotelInv,
          flightInv,
          roomsNeeded,
          seatsNeeded: G,
          group_size: G,
          unit_price_vnd: unitPriceVnd,
          expected_amount_vnd: expectedAmountVnd,
          retail_value_vnd: adjustedRetailTotalVnd,
          net_cost_vnd: Math.min(netTotalVnd, expectedAmountVnd),
          climate_bucket_id: dest.climate_bucket_id,
          climate_zone_label: dest.climate_zone_label,
          temp_range_label: dest.temp_range_label,
          flight_time_band: flight.time_band,
          hotel_star_tier: hotel.star_rating,
          vibe_tier_alias: hotel.vibe_tier_alias || "Boutique Sanctuary & Spa",
          mood_illustration_key: `MOOD_${dest.climate_bucket_id}`,
          display_price_band_vnd: formatDisplayPriceBand(unitPriceVnd),
          scoreBreakdown
        };

        if (!bestForDest || candidateObj.scoreBreakdown.sTotal > bestForDest.scoreBreakdown.sTotal) {
          bestForDest = candidateObj;
        }
      }
    }

    if (bestForDest) {
      destinationRepresentatives.push(bestForDest);
    }
  }

  // If total active destinations with inventory < 3, fail closed for k-anonymity!
  if (activeDestsWithInventory.size < 3) {
    const err = new Error("INSUFFICIENT_ANONYMITY_POOL: Fewer than 3 destinations have available inventory to guarantee k >= 3 anonymity.");
    err.code = "INSUFFICIENT_ANONYMITY_POOL";
    err.status = 422;
    throw err;
  }

  // If no candidate satisfies the hard budget filter
  if (destinationRepresentatives.length === 0) {
    const err = new Error(
      `NO_PACKAGE_WITHIN_HARD_BUDGET: No package fits within ${B_person.toLocaleString("vi-VN")} VND/person. Minimum required budget is ${
        Number.isFinite(minAvailableUnitPriceVnd) ? minAvailableUnitPriceVnd : 3500000
      } VND/person.`
    );
    err.code = "NO_PACKAGE_WITHIN_HARD_BUDGET";
    err.status = 422;
    err.minimumBudgetPerPersonVnd = Number.isFinite(minAvailableUnitPriceVnd) ? minAvailableUnitPriceVnd : 3500000;
    throw err;
  }

  if (destinationRepresentatives.length < 3) {
    const err = new Error("INSUFFICIENT_ANONYMITY_POOL: Fewer than 3 destinations satisfy the hard budget filter to guarantee k >= 3 anonymity.");
    err.code = "INSUFFICIENT_ANONYMITY_POOL";
    err.status = 422;
    throw err;
  }

  // Verify k-Anonymity (k >= 3) on each representative using Lattice Generalization
  const kVerifiedCandidates = [];
  for (const cand of destinationRepresentatives) {
    const kRes = enforceKAnonymityTuple(cand, destinationRepresentatives, 3);
    if (kRes) {
      kVerifiedCandidates.push({
        ...cand,
        ...kRes.generalizedAttributes,
        k_anonymity_count: kRes.kAnonymityCount,
        generalization_level: kRes.generalizationLevel
      });
    }
  }

  if (kVerifiedCandidates.length < 3) {
    const err = new Error("INSUFFICIENT_ANONYMITY_POOL: Equivalence class k >= 3 cannot be satisfied.");
    err.code = "INSUFFICIENT_ANONYMITY_POOL";
    err.status = 422;
    throw err;
  }

  // Stage 4A: Mandatory MMR Diversity Selection (lambda = 0.80, 3 distinct destinations)
  kVerifiedCandidates.sort((a, b) => b.scoreBreakdown.sTotal - a.scoreBreakdown.sTotal);
  const selected = [kVerifiedCandidates[0]];
  const remaining = kVerifiedCandidates.slice(1);

  while (selected.length < 3 && remaining.length > 0) {
    let bestIdx = 0;
    let bestMmr = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      let minDiv = Infinity;
      for (const s of selected) {
        const regionDiff = cand.destination.region !== s.destination.region ? 50 : 0;
        const climateDiff = cand.destination.climate_bucket_id !== s.destination.climate_bucket_id ? 50 : 0;
        const div = regionDiff + climateDiff;
        if (div < minDiv) minDiv = div;
      }
      const mmrScore = 0.80 * cand.scoreBreakdown.sTotal + 0.20 * minDiv;
      if (mmrScore > bestMmr) {
        bestMmr = mmrScore;
        bestIdx = i;
      }
    }

    selected.push(remaining.splice(bestIdx, 1)[0]);
  }

  // Stage 5: Anonymized Hint Selection & NFD Anti-Leak Gatekeeper
  const finalizedPackages = selected.map((item, idx) => {
    const rawHints = Array.isArray(item.destination.approved_mystery_hints_jsonb)
      ? item.destination.approved_mystery_hints_jsonb
      : [];
    const chosenHint = rawHints[idx % Math.max(1, rawHints.length)] ||
      "Hành trình nghỉ dưỡng bí mật giữa không gian thiên nhiên trong lành và dịch vụ 4-5 sao tuyển chọn.";
    const safeHint = sanitizePreRevealText(chosenHint);

    return {
      ...item,
      rank_order: idx + 1,
      is_top_pick: idx === 0,
      blind_code_alias: `MYSTERY-BOX-0${idx + 1}`,
      anonymized_hint: safeHint,
      packing_checklist: Array.isArray(item.destination.generic_packing_jsonb)
        ? item.destination.generic_packing_jsonb
        : ["Trang phục nghỉ dưỡng thoải mái", "Giày đi bộ êm chân", "Kính mát"]
    };
  });

  return {
    userVec,
    packages: finalizedPackages
  };
}
