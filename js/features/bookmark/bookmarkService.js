/**
 * Bookmark Feature - Service
 */

const STORAGE_KEY = "diplomastudy_bookmarks";

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

export const bookmarkService = {
  getAll() { return load().sort((a, b) => b.savedAt - a.savedAt); },

  has(id, type = "chapter") {
    return load().some((b) => b.id === id && b.type === type);
  },

  add(item) {
    const list = load();
    const idx = list.findIndex((b) => b.id === item.id && b.type === item.type);
    if (idx >= 0) list[idx] = { ...item, savedAt: Date.now() };
    else list.push({ ...item, savedAt: Date.now() });
    save(list);
    return true;
  },

  remove(id, type = "chapter") {
    save(load().filter((b) => !(b.id === id && b.type === type)));
    return true;
  },

  toggle(item) {
    if (this.has(item.id, item.type)) { this.remove(item.id, item.type); return false; }
    this.add(item);
    return true;
  },

  count() { return load().length; },
  clear() { save([]); }
};

export default bookmarkService;