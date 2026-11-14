// ============================================================================
// WANDERMATCH V4.2 — FRONTEND NOTIFICATIONS MODULE
// Fetches user in-app notifications and marks items as read through Worker V4.
// ============================================================================

export function createNotificationsModule({ apiClient }) {
  return {
    async fetchNotifications(limit = 20) {
      const safeLimit = Math.max(1, Math.min(100, Number(limit || 20)));
      return apiClient.get(`/api/v4/notifications?limit=${safeLimit}`, { requireAuth: true });
    },

    async markAsRead(notificationId) {
      if (!notificationId) {
        throw new Error("notificationId is required.");
      }
      return apiClient.post("/api/v4/notifications/read", { notificationId }, { requireAuth: true });
    },

    listNotifications(limit = 20) {
      return this.fetchNotifications(limit);
    },

    markNotificationRead(notificationId) {
      return this.markAsRead(notificationId);
    },

    countUnread(notifications = []) {
      if (!Array.isArray(notifications)) return 0;
      return notifications.filter(n => !n?.is_read).length;
    }
  };
}
