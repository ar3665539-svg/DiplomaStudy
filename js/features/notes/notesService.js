/**
 * Notes Feature - Service
 */

const STORAGE_KEY = "diplomastudy_notes";

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

export const notesService = {
  getAll() {
    return load().sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getById(id) {
    return load().find((n) => n.id === id) || null;
  },

  create({ title = "", content = "", subjectTag = "General", chapterTag = "" } = {}) {
    const notes = load();
    const note = {
      id: "note-" + Date.now(),
      title, content, subjectTag, chapterTag,
      isPinned: false,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    notes.push(note);
    save(notes);
    return note;
  },

  update(id, updates = {}) {
    const notes = load();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx < 0) return null;
    notes[idx] = { ...notes[idx], ...updates, updatedAt: Date.now() };
    save(notes);
    return notes[idx];
  },

  delete(id) {
    save(load().filter((n) => n.id !== id));
  },

  togglePin(id) {
    const note = this.getById(id);
    if (note) this.update(id, { isPinned: !note.isPinned });
  },

  toggleFavorite(id) {
    const note = this.getById(id);
    if (note) this.update(id, { isFavorite: !note.isFavorite });
  },

  search(query) {
    const q = (query || "").toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter((n) =>
      (n.title || "").toLowerCase().includes(q) ||
      (n.content || "").toLowerCase().includes(q) ||
      (n.subjectTag || "").toLowerCase().includes(q)
    );
  },

  clear() {
    save([]);
  }
};

export default notesService;