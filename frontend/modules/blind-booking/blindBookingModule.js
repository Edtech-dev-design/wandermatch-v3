// ============================================================================
// WANDERMATCH V4.1 — FRONTEND BLIND BOOKING MODULE
// Enforces pre-reveal k-anonymity verification and server-side reveal calls.
// ============================================================================

const FORBIDDEN_PRE_REVEAL_KEYS = [
  "secret_destination_id",
  "secret_hotel_id",
  "secret_outbound_flight_id",
  "secret_return_flight_id",
  "secret_payload_jsonb",
  "cityName",
  "hotelName",
  "flightCode"
];

export function verifySealedPackageZeroLeak(pkg) {
  if (!pkg || typeof pkg !== "object") {
    throw new Error("Invalid sealed package payload.");
  }
  for (const key of FORBIDDEN_PRE_REVEAL_KEYS) {
    if (key in pkg && pkg[key] !== null && pkg[key] !== undefined) {
      throw new Error(`PRE_REVEAL_LEAK_DETECTED: Forbidden field '${key}' present in sealed package.`);
    }
  }
  if (pkg.k_anonymity_count !== undefined && Number(pkg.k_anonymity_count) < 3) {
    throw new Error(`K_ANONYMITY_VIOLATION: Expected k >= 3, got ${pkg.k_anonymity_count}`);
  }
  return true;
}

export function createBlindBookingModule({ apiClient }) {
  return {
    verifySealedPackageZeroLeak,
    async getSealedPackages(sessionId) {
      const res = await apiClient.get(`/api/v4/packages/sealed?sessionId=${encodeURIComponent(sessionId)}`, {
        requireAuth: true
      });
      if (Array.isArray(res.packages)) {
        res.packages.forEach(verifySealedPackageZeroLeak);
      }
      return res;
    },
    async revealBlindBooking(bookingCode) {
      if (!bookingCode) throw new Error("bookingCode is required to reveal destination.");
      return apiClient.post("/api/v4/bookings/reveal", { bookingCode }, { requireAuth: true });
    }
  };
}

