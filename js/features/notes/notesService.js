/**
 * DiplomaStudy - Notes Service
 * Handles personal study notes, pin/unpin, favorite, search, tags, and persistence
 */

import { storage, STORAGE_KEYS } from "../../core/storage.js";
import { events } from "../../core/events.js";
import { Toast } from "../../components/Toast.js";

const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "Ohm's Law Key Formula & Limitations",
    content: "Remember: V = I × R holds true only for ohmic conductors at constant temperature.\nNon-linear devices (diodes, vacuum tubes) do not follow Ohm's Law!\nSpecific Resistance ρ = R*A / L, unit: Ohm-meter.",
    subjectTag: "Basic Electricity",
    chapterTag: "Chapter 1: Ohm's Law",
    isPinned: true,
    isFavorite: true,
    updatedAt: "2026-09-13T10:30:00.000Z"
  },
  {
    id: "note-2",
    title: "C Language Pointer Basics Summary",
    content: "*ptr gives the value at address. &var gives the memory address of var.\nArray name acts as a constant pointer to its first element: a[i] == *(a + i).\nAlways initialize pointers before dereferencing to avoid segmentation faults!",
    subjectTag: "Computer Programming (C)",
    chapterTag: "Chapter 3: Arrays & Pointers",
    isPinned: false,
    isFavorite: true,
    updatedAt: "2026-09-12T16:15:00.000Z"
  }
];

class NotesService {
  constructor() {
    this._notes = storage.get(STORAGE_KEYS.NOTES, DEFAULT_NOTES);
  }

  getAll() {
    // Sort pinned notes first, then latest updated
    return [...this._notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  getById(id) {
    return this._notes.find((n) => n.id === id) || null;
  }

  create({ title, content, subjectTag = "General", chapterTag = "" }) {
    const newNote = {
      id: "note-" + Date.now(),
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      subjectTag,
      chapterTag,
      isPinned: false,
      isFavorite: false,
      updatedAt: new Date().toISOString()
    };
    this._notes.unshift(newNote);
    this._save();
    Toast.show("Note created!", "success");
    events.emit("notes:changed");
    return newNote;
  }

  update(id, { title, content, subjectTag, chapterTag }) {
    const note = this.getById(id);
    if (!note) return null;
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (subjectTag !== undefined) note.subjectTag = subjectTag;
    if (chapterTag !== undefined) note.chapterTag = chapterTag;
    note.updatedAt = new Date().toISOString();
    this._save();
    Toast.show("Note updated!", "success");
    events.emit("notes:changed");
    return note;
  }

  delete(id) {
    const index = this._notes.findIndex((n) => n.id === id);
    if (index > -1) {
      this._notes.splice(index, 1);
      this._save();
      Toast.show("Note deleted", "info");
      events.emit("notes:changed");
      return true;
    }
    return false;
  }

  togglePin(id) {
    const note = this.getById(id);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString();
      this._save();
      Toast.show(note.isPinned ? "Note pinned to top" : "Note unpinned", "info");
      events.emit("notes:changed");
    }
  }

  toggleFavorite(id) {
    const note = this.getById(id);
    if (note) {
      note.isFavorite = !note.isFavorite;
      this._save();
      Toast.show(note.isFavorite ? "Saved to favorites" : "Removed from favorites", "info");
      events.emit("notes:changed");
    }
  }

  _save() {
    storage.set(STORAGE_KEYS.NOTES, this._notes);
  }
}

export const notesService = new NotesService();
