/**
 * DiplomaStudy - Bookmarks / My Saved Page View
 */

import { AppShell } from "../components/AppShell.js";
import { bookmarkService } from "../features/bookmark/bookmarkService.js";
import { questions } from "../../data/questions.js";
import { subjects } from "../../data/subjects.js";
import { pdfs } from "../../data/pdfs.js";
import { formulas } from "../../data/formulas.js";
import { suggestions } from "../../data/suggestions.js";
import { QuestionCard } from "../components/QuestionCard.js";
import { SubjectCard } from "../components/SubjectCard.js";
import { PdfCard } from "../components/PdfCard.js";
import { router } from "../core/router.js";

export function renderBookmarks() {
  AppShell.updateHeader({
    title: "My Saved Items",
    subtitle: "Quick revision bookmark vault",
    showBack: false,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let activeTab = "questions";

  const renderActiveTabContent = () => {
    const contentEl = main.querySelector("#bookmarks-content-slot");
    if (!contentEl) return;

    const allBookmarks = bookmarkService.getAll();

    if (activeTab === "questions") {
      const qIds = allBookmarks.questions || [];
      const savedQuestions = questions.filter((q) => qIds.includes(q.id));

      if (savedQuestions.length === 0) {
        contentEl.innerHTML = renderEmptyState("Questions", "#/departments", "Browse Question Bank");
        return;
      }

      contentEl.innerHTML = savedQuestions.map((q) =>
        QuestionCard.render(q, { isBookmarked: true, isCompleted: false })
      ).join("");

      QuestionCard.bindEvents(contentEl, {
        onBookmark: (id) => {
          bookmarkService.toggle("questions", id);
          renderActiveTabContent();
        }
      });
    } else if (activeTab === "subjects") {
      const sIds = allBookmarks.subjects || [];
      const savedSubs = subjects.filter((s) => sIds.includes(s.id));

      if (savedSubs.length === 0) {
        contentEl.innerHTML = renderEmptyState("Subjects", "#/departments", "Explore All Subjects");
        return;
      }

      contentEl.innerHTML = savedSubs.map((s) => SubjectCard.render(s)).join("");
      SubjectCard.bindClick(contentEl, (subjectId) => {
        router.navigate(`#/chapters?subjectId=${subjectId}`);
      });
    } else if (activeTab === "pdfs") {
      const pIds = allBookmarks.pdfs || [];
      const savedPdfs = pdfs.filter((p) => pIds.includes(p.id));

      if (savedPdfs.length === 0) {
        contentEl.innerHTML = renderEmptyState("PDFs", "#/pdfs", "Open PDF Library");
        return;
      }

      contentEl.innerHTML = savedPdfs.map((p) => PdfCard.render(p, { isBookmarked: true })).join("");
      PdfCard.bindEvents(contentEl, {
        onBookmark: (id) => {
          bookmarkService.toggle("pdfs", id);
          renderActiveTabContent();
        }
      });
    } else if (activeTab === "formulas") {
      const fIds = allBookmarks.formulas || [];
      const savedForms = formulas.filter((f) => fIds.includes(f.id));

      if (savedForms.length === 0) {
        contentEl.innerHTML = renderEmptyState("Formulas", "#/formula", "Browse Engineering Formulas");
        return;
      }

      contentEl.innerHTML = savedForms.map((f) => `
        <div class="card mb-md p-md">
          <div class="flex items-start justify-between mb-xs">
            <span class="badge badge-forest">${f.category}</span>
            <button class="header-icon-btn btn-remove-formula" data-id="${f.id}" title="Remove">⭐</button>
          </div>
          <h3 class="text-sm font-bold text-forest mb-xs">${f.name}</h3>
          <div class="p-xs mb-xs" style="background-color: var(--color-surface-hover); border-radius: var(--radius-xs);">
            <code class="text-xs font-bold text-forest">${f.formula}</code>
          </div>
          <p class="text-xs text-muted">${f.explanation}</p>
        </div>
      `).join("");

      contentEl.querySelectorAll(".btn-remove-formula").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          bookmarkService.toggle("formulas", id);
          renderActiveTabContent();
        });
      });
    } else if (activeTab === "suggestions") {
      const sugIds = allBookmarks.suggestions || [];
      const savedSugs = suggestions.filter((s) => sugIds.includes(s.id));

      if (savedSugs.length === 0) {
        contentEl.innerHTML = renderEmptyState("Suggestions", "#/suggestions", "View Super Suggestions");
        return;
      }

      contentEl.innerHTML = savedSugs.map((sug) => `
        <div class="card mb-md p-md">
          <div class="flex items-start justify-between mb-xs">
            <span class="badge badge-accent">${sug.category}</span>
            <button class="header-icon-btn btn-remove-sug" data-id="${sug.id}">⭐</button>
          </div>
          <h3 class="text-sm font-bold text-forest mb-xs">${sug.title}</h3>
          <p class="text-xs text-muted mb-xs">${sug.summary}</p>
          <p class="text-xs text-forest"><strong>Tip:</strong> ${sug.examTip}</p>
        </div>
      `).join("");

      contentEl.querySelectorAll(".btn-remove-sug").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          bookmarkService.toggle("suggestions", id);
          renderActiveTabContent();
        });
      });
    }
  };

  const renderEmptyState = (type, targetHash, targetText) => `
    <div class="empty-state">
      <div class="empty-state-icon">⭐</div>
      <h2 class="empty-state-title">No Saved ${type}</h2>
      <p class="empty-state-desc">You haven't bookmarked any ${type.toLowerCase()} yet. Tap the bookmark star icon on any card to save it for quick revision.</p>
      <a href="${targetHash}" class="btn btn-primary btn-sm">${targetText}</a>
    </div>
  `;

  main.innerHTML = `
    <!-- Bookmark Category Tabs -->
    <div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md" id="bookmark-tabs" style="scrollbar-width: none;">
      <button class="badge badge-forest active b-tab-btn" data-tab="questions">Questions</button>
      <button class="badge badge-sage b-tab-btn" data-tab="subjects">Subjects</button>
      <button class="badge badge-sage b-tab-btn" data-tab="pdfs">PDFs</button>
      <button class="badge badge-sage b-tab-btn" data-tab="formulas">Formulas</button>
      <button class="badge badge-sage b-tab-btn" data-tab="suggestions">Suggestions</button>
    </div>

    <div id="bookmarks-content-slot"></div>
  `;

  main.querySelectorAll(".b-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      main.querySelectorAll(".b-tab-btn").forEach((b) => b.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".b-tab-btn").forEach((b) => b.classList.add("badge-sage"));
      btn.classList.remove("badge-sage");
      btn.classList.add("badge-forest", "active");
      activeTab = btn.getAttribute("data-tab");
      renderActiveTabContent();
    });
  });

  renderActiveTabContent();
}
