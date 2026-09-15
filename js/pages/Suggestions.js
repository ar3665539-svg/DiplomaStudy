/**
 * DiplomaStudy - Suggestions Page View
 */

import { AppShell } from "../components/AppShell.js";
import { suggestions } from "../../data/suggestions.js";
import { bookmarkService } from "../features/bookmark/bookmarkService.js";
import { router } from "../core/router.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderSuggestions() {
  AppShell.updateHeader({
    title: "Super Suggestions",
    subtitle: "High probability board final topics",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const categories = [
    "All",
    "Most Important",
    "Very Important",
    "Important",
    "Exam Preparation",
    "Last Minute Revision"
  ];

  let selectedCategory = "All";
  let searchQuery = "";

  const renderList = () => {
    const listEl = main.querySelector("#suggestions-list");
    if (!listEl) return;

    let filtered = suggestions;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        (s.banglaTitle && s.banglaTitle.toLowerCase().includes(q)) ||
        s.summary.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <h2 class="empty-state-title">No Suggestions Match</h2>
          <p class="empty-state-desc">Try another category or clear search terms.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map((sug) => {
      const isBookmarked = bookmarkService.isBookmarked("suggestions", sug.id);
      return `
        <div class="card mb-md suggestion-card" data-id="${sug.id}" id="sug-card-${sug.id}">
          <div class="flex items-start justify-between mb-xs">
            <div class="flex items-center gap-xs flex-wrap">
              <span class="badge badge-forest">${sug.category}</span>
              <span class="badge badge-accent">${sug.categoryBadge}</span>
              <span class="text-xs text-dim">${sug.subjectName}</span>
            </div>
            <button class="header-icon-btn btn-bookmark-sug" data-id="${sug.id}" aria-label="Bookmark suggestion">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? "var(--color-accent)" : "none"}" stroke="${isBookmarked ? "var(--color-accent)" : "currentColor"}" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <h3 class="text-sm font-bold text-forest mb-xs">${sug.title}</h3>
          ${sug.banglaTitle ? `<p class="text-xs text-muted mb-xs font-semibold">${sug.banglaTitle}</p>` : ""}

          <p class="text-xs text-muted mb-sm" style="line-height: 1.4;">${sug.summary}</p>

          <div class="p-xs mb-sm" style="background-color: var(--color-surface-hover); border-radius: var(--radius-xs); border-left: 2px solid var(--color-accent);">
            <p class="text-xs text-text"><strong class="text-accent">💡 Exam Tip:</strong> ${sug.examTip}</p>
          </div>

          <div class="flex items-center justify-between pt-xs" style="border-top: 1px dashed var(--color-border);">
            <span class="text-xs text-dim">${sug.chapterName || "Chapter core"}</span>
            <button class="btn btn-secondary btn-sm btn-view-sug-q" data-subject="${sug.subjectId}" data-chapter="${sug.chapterId}">
              <span>View In Question Bank →</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Bookmark toggles
    listEl.querySelectorAll(".btn-bookmark-sug").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const added = bookmarkService.toggle("suggestions", id);
        const svg = btn.querySelector("svg");
        if (svg) {
          svg.setAttribute("fill", added ? "var(--color-accent)" : "none");
          svg.setAttribute("stroke", added ? "var(--color-accent)" : "currentColor");
        }
      });
    });

    // Navigate to linked question/chapter
    listEl.querySelectorAll(".btn-view-sug-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sub = btn.getAttribute("data-subject");
        const ch = btn.getAttribute("data-chapter");
        router.navigate(`#/questions?subjectId=${sub}&chapterId=${ch}`);
      });
    });
  };

  main.innerHTML = `
    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Search suggestions, formulas, tips...", id: "sug-search-input" })}
    </div>

    <!-- Category Chips -->
    <div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md" id="sug-category-chips" style="scrollbar-width: none;">
      ${categories.map((c) => `
        <button class="badge ${c === "All" ? "badge-forest active" : "badge-sage"} sug-cat-chip" data-cat="${c}">${c}</button>
      `).join("")}
    </div>

    <div id="suggestions-list"></div>
  `;

  main.querySelectorAll(".sug-cat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      main.querySelectorAll(".sug-cat-chip").forEach((c) => c.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".sug-cat-chip").forEach((c) => c.classList.add("badge-sage"));
      chip.classList.remove("badge-sage");
      chip.classList.add("badge-forest", "active");
      selectedCategory = chip.getAttribute("data-cat");
      renderList();
    });
  });

  SearchBar.bindEvents(main, (q) => {
    searchQuery = q.trim();
    renderList();
  }, "sug-search-input");

  renderList();
}
