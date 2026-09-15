/**
 * DiplomaStudy - Engineering Formulas Bank Page View
 */

import { AppShell } from "../components/AppShell.js";
import { formulas } from "../../data/formulas.js";
import { bookmarkService } from "../features/bookmark/bookmarkService.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderFormula() {
  AppShell.updateHeader({
    title: "Engineering Formulas",
    subtitle: "Equations, variables & units",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const categories = [
    "All",
    "Electrical Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Mathematics",
    "Physics"
  ];

  let activeCat = "All";
  let searchQuery = "";

  const renderFormulaCards = () => {
    const container = main.querySelector("#formula-list-container");
    if (!container) return;

    let filtered = formulas;
    if (activeCat !== "All") {
      filtered = filtered.filter((f) => f.category === activeCat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        (f.banglaName && f.banglaName.toLowerCase().includes(q)) ||
        f.formula.toLowerCase().includes(q) ||
        f.explanation.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📐</div>
          <h2 class="empty-state-title">No Formulas Found</h2>
          <p class="empty-state-desc">Try clearing the search query or select another engineering discipline.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((f) => {
      const isBookmarked = bookmarkService.isBookmarked("formulas", f.id);
      return `
        <div class="card mb-md p-md formula-card" data-id="${f.id}" id="form-card-${f.id}">
          <div class="flex items-start justify-between mb-xs">
            <div>
              <span class="badge badge-forest mb-xs">${f.category}</span>
              <h3 class="text-sm font-bold text-forest">${f.name}</h3>
              ${f.banglaName ? `<span class="text-xs text-muted">(${f.banglaName})</span>` : ""}
            </div>
            <button class="header-icon-btn btn-bookmark-formula" data-id="${f.id}" aria-label="Bookmark formula">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? "var(--color-accent)" : "none"}" stroke="${isBookmarked ? "var(--color-accent)" : "currentColor"}" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <!-- Formula Code Block -->
          <div class="p-sm my-xs" style="background-color: var(--color-surface-hover); border-radius: var(--radius-sm); border-left: 3px solid var(--color-forest);">
            <code class="text-sm font-bold text-forest" style="font-size: 15px;">${f.formula}</code>
          </div>

          <div class="text-xs text-muted mb-xs" style="line-height: 1.4;">
            <strong>Variables:</strong> ${f.variables}
          </div>

          <div class="text-xs text-muted mb-xs" style="line-height: 1.4;">
            <strong>Units:</strong> <span class="badge badge-sage" style="font-size: 11px;">${f.units}</span>
          </div>

          <p class="text-xs text-text mb-xs" style="line-height: 1.4;">${f.explanation}</p>

          ${f.example ? `
            <div class="p-xs mt-xs text-xs" style="background-color: var(--color-forest-soft); border-radius: var(--radius-xs); line-height: 1.4;">
              <strong class="text-forest">Example:</strong> ${f.example}
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-bookmark-formula").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const added = bookmarkService.toggle("formulas", id);
        const svg = btn.querySelector("svg");
        if (svg) {
          svg.setAttribute("fill", added ? "var(--color-accent)" : "none");
          svg.setAttribute("stroke", added ? "var(--color-accent)" : "currentColor");
        }
      });
    });
  };

  main.innerHTML = `
    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Search formulas by name, equation...", id: "formula-search-input" })}
    </div>

    <!-- Category Chips -->
    <div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md" id="formula-category-chips" style="scrollbar-width: none;">
      ${categories.map((c) => `
        <button class="badge ${c === "All" ? "badge-forest active" : "badge-sage"} f-cat-chip" data-cat="${c}">${c}</button>
      `).join("")}
    </div>

    <div id="formula-list-container"></div>
  `;

  main.querySelectorAll(".f-cat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      main.querySelectorAll(".f-cat-chip").forEach((c) => c.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".f-cat-chip").forEach((c) => c.classList.add("badge-sage"));
      chip.classList.remove("badge-sage");
      chip.classList.add("badge-forest", "active");
      activeCat = chip.getAttribute("data-cat");
      renderFormulaCards();
    });
  });

  SearchBar.bindEvents(main, (q) => {
    searchQuery = q.trim();
    renderFormulaCards();
  }, "formula-search-input");

  renderFormulaCards();
}
