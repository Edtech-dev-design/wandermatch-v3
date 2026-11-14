// ============================================================================
// WANDERMATCH V4.1 — FRONTEND BOOKING MODULE
// Handles atomic booking creation and inventory hold lifecycle via Worker API
// ============================================================================

export function createBookingModule({ apiClient }) {
  return {
    async createBookingWithHold({
      packageId,
      bookingCode = null,
      departureDate = "2026-11-15",
      durationDays = 3,
      travelers = []
    }) {
      if (!packageId) {
        throw new Error("packageId is required to create a booking.");
      }
      return apiClient.post(
        "/api/v4/bookings",
        {
          packageId,
          bookingCode,
          departureDate,
          durationDays: Number(durationDays || 3),
          travelers: Array.isArray(travelers) ? travelers : []
        },
        { requireAuth: true }
      );
    }
  };
}

