/**
 * DiplomaStudy - Sync Service
 * Handles online/offline state + data refresh
 */

import { clearCache } from "./api.js";
import { Toast } from "../components/Toast.js";

let onlineHandler = null;
let offlineHandler = null;

export const syncService = {
  isOnline() {
    return navigator.onLine !== false;
  },

  /**
   * Manually refresh all data
   */
  async refreshAll() {
    try {
      clearCache();
      Toast.info("🔄 Refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (e) {
      Toast.error("Refresh failed");
    }
  },

  /**
   * Watch connection status
   */
  watchConnection(onChange) {
    this.unwatchConnection();

    onlineHandler = () => {
      if (onChange) onChange(true);
      Toast.success("✅ অনলাইন");
    };

    offlineHandler = () => {
      if (onChange) onChange(false);
      Toast.warning("📡 অফলাইন");
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);
  },

  unwatchConnection() {
    if (onlineHandler) { window.removeEventListener("online", onlineHandler); onlineHandler = null; }
    if (offlineHandler) { window.removeEventListener("offline", offlineHandler); offlineHandler = null; }
  },

  /**
   * Get last sync time
   */
  getLastSync() {
    try {
      const raw = localStorage.getItem("diplomastudy_last_sync");
      return raw ? parseInt(raw, 10) : null;
    } catch (e) { return null; }
  },

  /**
   * Save sync timestamp
   */
  markSynced() {
    try { localStorage.setItem("diplomastudy_last_sync", String(Date.now())); }
    catch (e) {}
  }
};

export default syncService;