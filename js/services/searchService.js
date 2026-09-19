/**
 * DiplomaStudy - Search Service v2
 * Server-side search across ALL content types.
 * One query per type, all parallel. Much faster.
 */

import { supabase } from "../core/supabase.js";

// Emoji as unicode escapes - safe to paste
const ICON_SUB   = "\uD83D\uDCD8"; // book
const ICON_CHAP  = "\uD83D\uDCD6"; // open book
const ICON_PDF   = "\uD83D\uDCC4"; // page
const ICON_SUG   = "\uD83D\uDCA1"; // bulb
const ICON_FORM  = "\uD83E\uDDEE"; // abacus
const ICON_NOTI  = "\uD83D\uDCE2"; // megaphone
const ICON_QUES  = "\u2753";       // question mark

function safeQuery(fn) {
  return Promise.resolve().then(fn).catch(function (e) {
    console.warn("[Search] query failed:", e && e.message);
    return [];
  });
}

export const searchService = {
  async search(query, options) {
    const q = (query || "").trim();
    if (q.length < 2) return [];

    if (!options) options = {};
    const limit = options.limit || 40;

    const pattern = "%" + q + "%";

    // ── Run all queries in parallel ──
    const tasks = [

      // 1. Subjects
      safeQuery(async function () {
        const res = await supabase.from("subjects")
          .select("id, name, bangla_name, code, icon")
          .eq("is_active", true)
          .or("name.ilike." + pattern + ",bangla_name.ilike." + pattern + ",code.ilike." + pattern)
          .limit(8);
        return (res.data || []).map(function (s) {
          return {
            type: "subject", id: s.id,
            title: s.name,
            subtitle: s.code || s.bangla_name || "",
            icon: s.icon || ICON_SUB,
            route: "#/subject?subjectId=" + s.id
          };
        });
      }),

      // 2. Chapters
      safeQuery(async function () {
        const res = await supabase.from("chapters")
          .select("id, subject_id, name, name_en, category, icon")
          .eq("is_active", true)
          .or("name.ilike." + pattern + ",name_en.ilike." + pattern + ",category.ilike." + pattern)
          .limit(10);
        return (res.data || []).map(function (c) {
          return {
            type: "chapter", id: c.id,
            title: c.name,
            subtitle: c.category || "",
            icon: c.icon || ICON_CHAP,
            route: "#/content?subjectId=" + c.subject_id + "&chapterId=" + c.id
          };
        });
      }),

      // 3. PDFs
      safeQuery(async function () {
        const res = await supabase.from("pdfs")
          .select("id, subject_id, chapter_id, title, file_name, file_path")
          .eq("is_active", true)
          .or("title.ilike." + pattern + ",file_name.ilike." + pattern)
          .limit(8);
        return (res.data || []).map(function (p) {
          return {
            type: "pdf", id: p.id,
            title: p.title,
            subtitle: p.file_name || "",
            icon: ICON_PDF,
            route: "#/pdfs"
          };
        });
      }),

      // 4. Suggestions
      safeQuery(async function () {
        const res = await supabase.from("suggestions")
          .select("id, subject_id, chapter_id, title, summary, category")
          .eq("is_active", true)
          .or("title.ilike." + pattern + ",summary.ilike." + pattern)
          .limit(8);
        return (res.data || []).map(function (s) {
          return {
            type: "suggestion", id: s.id,
            title: s.title,
            subtitle: s.category || "",
            icon: ICON_SUG,
            route: "#/suggestions"
          };
        });
      }),

      // 5. Formulas
      safeQuery(async function () {
        const res = await supabase.from("formulas")
          .select("id, subject_id, chapter_id, name, equation")
          .eq("is_active", true)
          .or("name.ilike." + pattern + ",equation.ilike." + pattern)
          .limit(8);
        return (res.data || []).map(function (f) {
          return {
            type: "formula", id: f.id,
            title: f.name,
            subtitle: f.equation || "",
            icon: ICON_FORM,
            route: "#/formulas"
          };
        });
      }),

      // 6. Notices
      safeQuery(async function () {
        const res = await supabase.from("notices")
          .select("id, title, content, audience")
          .eq("is_active", true).eq("is_published", true)
          .or("title.ilike." + pattern + ",content.ilike." + pattern)
          .limit(6);
        return (res.data || []).map(function (n) {
          var text = (n.content || "").replace(/[#*_`>]/g, "").substring(0, 80);
          return {
            type: "notice", id: n.id,
            title: n.title,
            subtitle: text,
            icon: ICON_NOTI,
            route: "#/notices"
          };
        });
      }),

      // 7. Questions
      safeQuery(async function () {
        const res = await supabase.from("questions")
          .select("id, subject_id, chapter_id, question, question_en")
          .eq("is_active", true)
          .or("question.ilike." + pattern + ",question_en.ilike." + pattern)
          .limit(6);
        return (res.data || []).map(function (q) {
          var txt = (q.question || "").substring(0, 70);
          return {
            type: "question", id: q.id,
            title: txt,
            subtitle: "",
            icon: ICON_QUES,
            route: "#/questions"
          };
        });
      })
    ];

    const groups = await Promise.all(tasks);

    // Flatten and cap total
    var all = [];
    groups.forEach(function (g) { all = all.concat(g); });
    return all.slice(0, limit);
  },

  saveRecent(query) {
    try {
      var key = "diplomastudy_recent_searches";
      var raw = localStorage.getItem(key);
      var list = raw ? JSON.parse(raw) : [];
      list = [query].concat(list.filter(function (x) { return x !== query; })).slice(0, 10);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  },

  getRecent() {
    try {
      var raw = localStorage.getItem("diplomastudy_recent_searches");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  },

  clearRecent() {
    try { localStorage.removeItem("diplomastudy_recent_searches"); }
    catch (e) {}
  }
};

export default searchService;