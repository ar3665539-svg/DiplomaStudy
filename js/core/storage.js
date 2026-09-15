/**
 * DiplomaStudy - Central Storage Engine
 * Safe localStorage wrapper with try/catch, JSON validation and defaults
 */

export const STORAGE_KEYS = {
  SETTINGS: "diplomastudy_settings",
  BOOKMARKS: "diplomastudy_bookmarks",
  NOTES: "diplomastudy_notes",
  PROGRESS: "diplomastudy_progress",
  QUIZ_RESULTS: "diplomastudy_quiz_results",
  PLANNER: "diplomastudy_planner",
  STUDY_HISTORY: "diplomastudy_study_history",
  STREAK: "diplomastudy_streak"
};

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[Storage] Failed to read ${key}:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[Storage] Failed to write ${key}:`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[Storage] Failed to remove ${key}:`, err);
      return false;
    }
  },

  clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (err) {
      console.warn("[Storage] Clear failed:", err);
      return false;
    }
  },

  exportAllData() {
    const backup = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      backup[key] = this.get(key, null);
    });
    backup._exportedAt = new Date().toISOString();
    backup._app = "DiplomaStudy";
    backup._version = "1.0.0";
    return JSON.stringify(backup, null, 2);
  },

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid JSON format");
      }
      Object.values(STORAGE_KEYS).forEach((key) => {
        if (parsed[key] !== undefined) {
          this.set(key, parsed[key]);
        }
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
