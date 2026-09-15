/**
 * DiplomaStudy - Bookmark Service
 * Manages saving and removing questions, subjects, PDFs, formulas, and suggestions
 */

import { storage, STORAGE_KEYS } from "../../core/storage.js";
import { events } from "../../core/events.js";
import { Toast } from "../../components/Toast.js";

class BookmarkService {
  constructor() {
    this._bookmarks = storage.get(STORAGE_KEYS.BOOKMARKS, {
      questions: ["q-elec-1", "q-math-1"],
      subjects: ["basic-elec", "cst-prog-c"],
      pdfs: ["pdf-elec-handnote"],
      formulas: ["form-ohm", "form-power"],
      suggestions: ["sug-1", "sug-2"]
    });
  }

  getAll() {
    return this._bookmarks;
  }

  getByCategory(category) {
    if (category === "all") return this._bookmarks;
    return this._bookmarks[category] || [];
  }

  isBookmarked(category, id) {
    if (!this._bookmarks[category]) return false;
    return this._bookmarks[category].includes(id);
  }

  toggle(category, id, title = "Item") {
    if (!this._bookmarks[category]) {
      this._bookmarks[category] = [];
    }

    const index = this._bookmarks[category].indexOf(id);
    let added = false;
    if (index > -1) {
      this._bookmarks[category].splice(index, 1);
      Toast.show(`Removed from bookmarks`, "info");
    } else {
      this._bookmarks[category].push(id);
      Toast.show(`Saved to bookmarks!`, "success");
      added = true;
    }

    this._save();
    events.emit("bookmarks:changed", { category, id, added });
    return added;
  }

  _save() {
    storage.set(STORAGE_KEYS.BOOKMARKS, this._bookmarks);
  }
}

export const bookmarkService = new BookmarkService();
