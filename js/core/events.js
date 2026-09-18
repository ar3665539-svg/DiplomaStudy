/**
 * DiplomaStudy - Simple Event Bus
 */

const listeners = new Map();

export const events = {
  on(eventName, callback) {
    if (!listeners.has(eventName)) listeners.set(eventName, new Set());
    listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  },

  off(eventName, callback) {
    if (!listeners.has(eventName)) return;
    listeners.get(eventName).delete(callback);
  },

  emit(eventName, data) {
    if (!listeners.has(eventName)) return;
    listeners.get(eventName).forEach((cb) => {
      try { cb(data); } catch (e) { console.warn(`[Events] ${eventName} error:`, e); }
    });
  },

  clear(eventName) {
    if (eventName) listeners.delete(eventName);
    else listeners.clear();
  }
};

// Event name constants
export const EVENTS = {
  CONTENT_CHANGED: "content:changed",
  SELECTION_CHANGED: "selection:changed",
  THEME_CHANGED: "theme:changed",
  ONLINE: "network:online",
  OFFLINE: "network:offline"
};

export default events;