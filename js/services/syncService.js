/**
 * DiplomaStudy - Sync Service
 * Foundation for cloud sync without requiring a backend in Version 1
 */

import { storage } from "../core/storage.js";
import { Toast } from "../components/Toast.js";

export const syncService = {
  isCloudConnected() {
    return false; // Offline-first in Version 1
  },

  getStatus() {
    return {
      status: "offline_mode",
      lastLocalChange: new Date().toISOString(),
      pendingChanges: 0,
      cloudConnected: false
    };
  },

  async syncNow() {
    Toast.show("Running in Local Offline Mode. Data saved locally.", "info");
    return { success: true, mode: "local" };
  },

  exportBackup() {
    return storage.exportAllData();
  },

  importBackup(jsonString) {
    return storage.importData(jsonString);
  }
};
