/**
 * DiplomaStudy - Global Search Service
 * Fast in-memory search across subjects, questions, suggestions, PDFs, formulas, jobs, notices, and notes
 */

import { subjects } from "../../data/subjects.js";
import { questions } from "../../data/questions.js";
import { suggestions } from "../../data/suggestions.js";
import { pdfs } from "../../data/pdfs.js";
import { formulas } from "../../data/formulas.js";
import { jobs } from "../../data/jobs.js";
import { notices } from "../../data/notices.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export function globalSearch(query) {
  if (!query || typeof query !== "string") return [];
  const q = query.toLowerCase().trim();
  const results = [];

  // Search Subjects
  subjects.forEach((s) => {
    if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
      results.push({
        type: "Subject",
        title: `${s.name} (${s.code})`,
        subtitle: `Semester ${s.semesterId}`,
        route: `#/chapters?subjectId=${s.id}`
      });
    }
  });

  // Search Questions
  questions.forEach((qu) => {
    if (
      qu.question.toLowerCase().includes(q) ||
      (qu.questionBangla && qu.questionBangla.toLowerCase().includes(q)) ||
      qu.answer.toLowerCase().includes(q)
    ) {
      results.push({
        type: "Question",
        title: qu.question,
        subtitle: `${qu.type.toUpperCase()} • ${qu.difficulty}`,
        route: `#/questions?subjectId=${qu.subjectId}&chapterId=${qu.chapterId}`
      });
    }
  });

  // Search Formulas
  formulas.forEach((f) => {
    if (f.name.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)) {
      results.push({
        type: "Formula",
        title: `${f.name}: ${f.formula}`,
        subtitle: f.category,
        route: "#/formula"
      });
    }
  });

  // Search Suggestions
  suggestions.forEach((sg) => {
    if (sg.title.toLowerCase().includes(q) || sg.summary.toLowerCase().includes(q)) {
      results.push({
        type: "Suggestion",
        title: sg.title,
        subtitle: sg.category,
        route: "#/suggestions"
      });
    }
  });

  // Search PDFs
  pdfs.forEach((p) => {
    if (p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
      results.push({
        type: "PDF Document",
        title: p.title,
        subtitle: `${p.category} • ${p.pages} pages`,
        route: "#/pdfs"
      });
    }
  });

  // Search Jobs
  jobs.forEach((j) => {
    if (j.title.toLowerCase().includes(q) || j.organization.toLowerCase().includes(q) || j.technology.toLowerCase().includes(q)) {
      results.push({
        type: "Job Opportunity",
        title: j.title,
        subtitle: j.organization,
        route: "#/jobs"
      });
    }
  });

  // Search Notices
  notices.forEach((n) => {
    if (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)) {
      results.push({
        type: "Notice",
        title: n.title,
        subtitle: `${n.category} • ${n.date}`,
        route: "#/notices"
      });
    }
  });

  // Search User Notes
  const userNotes = storage.get(STORAGE_KEYS.NOTES, []);
  userNotes.forEach((note) => {
    if (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)) {
      results.push({
        type: "My Note",
        title: note.title,
        subtitle: note.subjectTag || "Personal",
        route: "#/notes"
      });
    }
  });

  return results;
}
