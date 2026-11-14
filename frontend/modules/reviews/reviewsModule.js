// ============================================================================
// WANDERMATCH V4.2 — FRONTEND REVIEWS & FEEDBACK MODULE
// Handles verified post-reveal trip reviews and public social proof via Worker.
// ============================================================================

export function createReviewsModule({ apiClient }) {
  return {
    async listApprovedReviews(limit = 20) {
      const safeLimit = Math.max(1, Math.min(100, Number(limit || 20)));
      return apiClient.get(`/api/v4/reviews?limit=${safeLimit}`, { requireAuth: false });
    },

    listReviews(limit = 20) {
      return this.listApprovedReviews(limit);
    },

    async submitReview({ bookingCode, rating = 5, aiMatchRating = 5, reviewText = "" } = {}) {
      const cleanCode = String(bookingCode || "").trim().toUpperCase();
      if (!cleanCode) {
        throw new Error("bookingCode is required to submit a review.");
      }
      const cleanText = String(reviewText || "").trim();
      if (cleanText.length < 5) {
        throw new Error("Review text must be at least 5 characters.");
      }
      return apiClient.post(
        "/api/v4/reviews",
        {
          bookingCode: cleanCode,
          rating: Math.max(1, Math.min(5, Number(rating || 5))),
          aiMatchRating: Math.max(1, Math.min(5, Number(aiMatchRating || rating || 5))),
          reviewText: cleanText
        },
        { requireAuth: true }
      );
    }
  };
}
