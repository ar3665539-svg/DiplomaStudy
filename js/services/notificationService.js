/**
 * DiplomaStudy - Notification Service (Toast-based)
 */

import { Toast } from "../components/Toast.js";

const STORAGE_KEY = "diplomastudy_notifications";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50))); }
  catch (e) {}
}

export const notificationService = {
  push(message, type = "info") {
    const list = load();
    list.push({ id: "n-" + Date.now(), message, type, at: Date.now(), read: false });
    save(list);

    // Show toast immediately
    Toast.show(message, type);
  },

  getAll() {
    return load().sort((a, b) => b.at - a.at);
  },

  getUnread() {
    return load().filter((n) => !n.read);
  },

  getUnreadCount() {
    return this.getUnread().length;
  },

  markAsRead(id) {
    const list = load().map((n) => n.id === id ? { ...n, read: true } : n);
    save(list);
  },

  markAllAsRead() {
    const list = load().map((n) => ({ ...n, read: true }));
    save(list);
  },

  clear() {
    save([]);
  }
};

export default notificationService;