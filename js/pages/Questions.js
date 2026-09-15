/**
 * DiplomaStudy - Questions Page View
 */

import { AppShell } from "../components/AppShell.js";
import { getQuestionsBySubjectAndChapter } from "../../data/questions.js";
import { getSubjectById } from "../../data/subjects.js";
import { bookmarkService } from "../features/bookmark/bookmarkService.js";
import { QuestionCard } from "../components/QuestionCard.js";
import { SearchBar } from "../components/SearchBar.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export function renderQuestions(params = {}) {
  const subjectId = params.subjectId || "basic-elec";
  const chapterId = params.chapterId || "elec-ch1";
  const subject = getSubjectById(subjectId) || { name: "Question Bank" };

  const allQuestions = getQuestionsBySubjectAndChapter(subjectId, chapterId);
  const completedList = storage.get(STORAGE_KEYS.PROGRESS, { completedQuestions: [] }).completedQuestions || [];

  AppShell.updateHeader({
    title: subject.name,
    subtitle: "Question Bank & Solutions",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let activeType = "all";
  let activeSearch = "";

  const renderCards = () => {
    const listContainer = main.querySelector("#questions-list-container");
    if (!listContainer) return;

    let filtered = allQuestions;

    // Filter by type
    if (activeType === "board") {
      filtered = filtered.filter((q) => !!q.board);
    } else if (activeType === "important") {
      filtered = filtered.filter((q) => !!q.important);
    } else if (activeType !== "all") {
      filtered = filtered.filter((q) => q.type === activeType);
    }

    // Filter by search text
    if (activeSearch) {
      const qText = activeSearch.toLowerCase();
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(qText) ||
        (q.questionBangla && q.questionBangla.toLowerCase().includes(qText)) ||
        q.answer.toLowerCase().includes(qText)
      );
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h2 class="empty-state-title">No Questions Match Filter</h2>
          <p class="empty-state-desc">Try clearing the search query or selecting "All Types".</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map((q) => {
      const isBookmarked = bookmarkService.isBookmarked("questions", q.id);
      const isCompleted = completedList.includes(q.id);
      return QuestionCard.render(q, { isBookmarked, isCompleted });
    }).join("");

    QuestionCard.bindEvents(listContainer, {
      onBookmark: (id, btn) => {
        const added = bookmarkService.toggle("questions", id);
        const svg = btn.querySelector("svg");
        if (svg) {
          svg.setAttribute("fill", added ? "var(--color-accent)" : "none");
          svg.setAttribute("stroke", added ? "var(--color-accent)" : "currentColor");
        }
      },
      onToggleComplete: (id, completed) => {
        const prog = storage.get(STORAGE_KEYS.PROGRESS, { completedQuestions: [] });
        if (!prog.completedQuestions) prog.completedQuestions = [];
        const idx = prog.completedQuestions.indexOf(id);
        if (completed && idx === -1) {
          prog.completedQuestions.push(id);
        } else if (!completed && idx > -1) {
          prog.completedQuestions.splice(idx, 1);
        }
        storage.set(STORAGE_KEYS.PROGRESS, prog);
      }
    });
  };

  main.innerHTML = `
    <!-- Top Search Bar -->
    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Search within this chapter questions...", id: "q-search-input" })}
    </div>

    <!-- Filter Chips -->
    <div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md" id="q-filter-chips" style="scrollbar-width: none;">
      <button class="badge badge-forest filter-chip active" data-type="all">All (${allQuestions.length})</button>
      <button class="badge badge-sage filter-chip" data-type="board">Board Qs</button>
      <button class="badge badge-danger filter-chip" data-type="important">★ Important</button>
      <button class="badge badge-sage filter-chip" data-type="short">Short</button>
      <button class="badge badge-sage filter-chip" data-type="mcq">MCQ</button>
      <button class="badge badge-sage filter-chip" data-type="creative">Creative</button>
    </div>

    <div id="questions-list-container"></div>
  `;

  // Bind filter chips
  main.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      main.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".filter-chip").forEach((c) => c.classList.add("badge-sage"));
      chip.classList.remove("badge-sage");
      chip.classList.add("badge-forest", "active");
      activeType = chip.getAttribute("data-type");
      renderCards();
    });
  });

  // Bind search input
  SearchBar.bindEvents(main, (text) => {
    activeSearch = text.trim();
    renderCards();
  }, "q-search-input");

  renderCards();
}
