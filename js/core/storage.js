/**
 * DiplomaStudy - Storage Manager (localStorage wrapper)
 */

export const STORAGE_KEYS = {
  SETTINGS: "diplomastudy_settings",
  THEME: "diplomastudy_theme",
  ONBOARDING_DONE: "diplomastudy_onboarding_done",
  LAST_VISIT: "diplomastudy_last_visit",
  GOAL: "diplomastudy_goal",
  STREAK: "diplomastudy_streak",
  BOOKMARKS: "diplomastudy_bookmarks",
  PROGRESS: "diplomastudy_progress",
  NOTES: "diplomastudy_notes",
  PLANNER: "diplomastudy_planner"
};

function safeGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[Storage] Failed to parse ${key}:`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[Storage] Failed to save ${key}:`, e);
    return false;
  }
}

function safeRemove(key) {
  try { localStorage.removeItem(key); return true; }
  catch (e) { return false; }
}

export const storage = {
  get(key, fallback = null) { return safeGet(key, fallback); },
  set(key, value) { return safeSet(key, value); },
  remove(key) { return safeRemove(key); },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (e) { return false; }
  },

  has(key) {
    try { return localStorage.getItem(key) !== null; }
    catch (e) { return false; }
  }
};

export default storage;