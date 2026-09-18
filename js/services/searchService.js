/**
 * DiplomaStudy - Search Service
 * Global content search
 */

import {
  getSubjects,
  getChaptersBySubject,
  getPdfsBySubject,
  getSuggestionsBySubject,
  getFormulasByChapter
} from "./api.js";

export const searchService = {
  /**
   * Global search across all content types
   */
  async search(query, options = {}) {
    const q = (query || "").toLowerCase().trim();
    if (q.length < 2) return [];

    const { types = ["subject", "chapter", "pdf", "suggestion"], limit = 30 } = options;
    const results = [];

    try {
      // Subjects
      if (types.includes("subject")) {
        const subjects = await getSubjects();
        subjects.forEach((s) => {
          if (
            (s.name || "").toLowerCase().includes(q) ||
            (s.banglaName || "").toLowerCase().includes(q) ||
            (s.code || "").toLowerCase().includes(q)
          ) {
            results.push({
              type: "subject",
              id: s.id,
              title: s.name,
              subtitle: s.code || s.banglaName,
              icon: s.icon || "📘",
              route: `#/subject?subjectId=${s.id}`
            });
          }
        });
      }

      // Chapters (from subjects)
      if (types.includes("chapter")) {
        const subjects = await getSubjects();
        for (const sub of subjects) {
          const chapters = await getChaptersBySubject(sub.id);
          chapters.forEach((c) => {
            if (
              (c.name || "").toLowerCase().includes(q) ||
              (c.nameEn || "").toLowerCase().includes(q) ||
              (c.category || "").toLowerCase().includes(q)
            ) {
              results.push({
                type: "chapter",
                id: c.id,
                title: c.name,
                subtitle: `${sub.name} • ${c.category || ""}`,
                icon: c.icon || "📖",
                route: `#/content?subjectId=${sub.id}&chapterId=${c.id}`
              });
            }
          });
        }
      }

      // PDFs
      if (types.includes("pdf")) {
        const subjects = await getSubjects();
        for (const sub of subjects) {
          const pdfs = await getPdfsBySubject(sub.id);
          pdfs.forEach((p) => {
            if (
              (p.title || "").toLowerCase().includes(q) ||
              (p.fileName || "").toLowerCase().includes(q)
            ) {
              results.push({
                type: "pdf",
                id: p.id,
                title: p.title,
                subtitle: `${sub.name} • ${p.fileSize || ""}`,
                icon: "📄",
                route: p.fileUrl ? p.fileUrl : `#/pdfs`
              });
            }
          });
        }
      }

      // Suggestions
      if (types.includes("suggestion")) {
        const subjects = await getSubjects();
        for (const sub of subjects) {
          const sug = await getSuggestionsBySubject(sub.id);
          sug.forEach((s) => {
            if (
              (s.title || "").toLowerCase().includes(q) ||
              (s.summary || "").toLowerCase().includes(q)
            ) {
              results.push({
                type: "suggestion",
                id: s.id,
                title: s.title,
                subtitle: `${sub.name} • ${s.category || ""}`,
                icon: "💡",
                route: `#/suggestions`
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("[Search] Error:", e);
    }

    return results.slice(0, limit);
  },

  /**
   * Save recent searches
   */
  saveRecent(query) {
    try {
      const key = "diplomastudy_recent_searches";
      const raw = localStorage.getItem(key);
      let list = raw ? JSON.parse(raw) : [];
      list = [query, ...list.filter((x) => x !== query)].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  },

  getRecent() {
    try {
      const raw = localStorage.getItem("diplomastudy_recent_searches");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  },

  clearRecent() {
    try { localStorage.removeItem("diplomastudy_recent_searches"); }
    catch (e) {}
  }
};

export default searchService;