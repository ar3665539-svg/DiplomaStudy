/**
 * Planner Feature - Service
 */

const STORAGE_KEY = "diplomastudy_planner";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  catch (e) {}
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const plannerService = {
  getAll() {
    return load();
  },

  getToday() {
    const t = todayKey();
    return load().filter((x) => x.date === t).sort((a, b) => a.done - b.done);
  },

  getByDate(date) {
    return load().filter((x) => x.date === date).sort((a, b) => a.done - b.done);
  },

  add(text, date = null) {
    if (!text || !text.trim()) return null;
    const tasks = load();
    const task = {
      id: "task-" + Date.now(),
      text: text.trim(),
      date: date || todayKey(),
      done: false,
      createdAt: Date.now()
    };
    tasks.push(task);
    save(tasks);
    return task;
  },

  toggle(id) {
    const tasks = load().map((t) =>
      t.id === id ? { ...t, done: !t.done, updatedAt: Date.now() } : t
    );
    save(tasks);
  },

  update(id, updates = {}) {
    const tasks = load().map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
    );
    save(tasks);
  },

  delete(id) {
    save(load().filter((t) => t.id !== id));
  },

  getStats() {
    const today = this.getToday();
    return {
      total: today.length,
      done: today.filter((t) => t.done).length,
      pending: today.filter((t) => !t.done).length
    };
  },

  clearDone() {
    save(load().filter((t) => !t.done));
  },

  clear() {
    save([]);
  }
};

export default plannerService;