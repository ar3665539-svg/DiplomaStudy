/**
 * DiplomaStudy - Notification Service
 * Handles browser notifications with permission checks and graceful fallbacks
 */

import { Toast } from "../components/Toast.js";

export const notificationService = {
  isSupported() {
    return "Notification" in window;
  },

  async requestPermission() {
    if (!this.isSupported()) {
      Toast.show("Notifications not supported in this browser", "warning");
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        Toast.show("Study reminders enabled!", "success");
        return true;
      }
      Toast.show("Notifications permission denied", "info");
      return false;
    } catch (err) {
      console.warn("[NotificationService] Permission request error:", err);
      return false;
    }
  },

  notify(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== "granted") {
      // Fallback to in-app Toast
      Toast.show(title, "info");
      return;
    }

    try {
      new Notification(title, {
        icon: "/assets/icons/icon-192.png",
        badge: "/assets/icons/icon-192.png",
        ...options
      });
    } catch (err) {
      Toast.show(title, "info");
    }
  }
};
