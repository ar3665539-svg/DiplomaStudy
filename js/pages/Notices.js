/**
 * DiplomaStudy - Notice Center Page View
 */

import { AppShell } from "../components/AppShell.js";
import { notices } from "../../data/notices.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderNotices() {
  AppShell.updateHeader({
    title: "BTEB Notice Center",
    subtitle: "Exam routines, results & board circulars",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const categories = ["All", "Routine", "Exam", "Result", "Scholarship", "Academic"];
  let selectedCat = "All";
  let searchQuery = "";

  const renderNoticeCards = () => {
    const container = main.querySelector("#notices-list-container");
    if (!container) return;

    let filtered = notices;
    if (selectedCat !== "All") {
      filtered = filtered.filter((n) => n.category === selectedCat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(q) ||
        (n.banglaTitle && n.banglaTitle.toLowerCase().includes(q)) ||
        n.description.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state"><p class="empty-state-desc">No notices found for this filter.</p></div>`;
      return;
    }

    container.innerHTML = filtered.map((n) => `
      <div class="card mb-md p-md ${n.pinned ? "card-highlight" : ""}" style="border-left: 4px solid ${n.pinned ? "var(--color-accent)" : "var(--color-forest)"};">
        <div class="flex items-start justify-between mb-xs">
          <div class="flex items-center gap-xs flex-wrap">
            ${n.pinned ? `<span class="badge badge-accent">📌 Pinned</span>` : ""}
            <span class="badge badge-forest">${n.category}</span>
            <span class="text-xs text-dim">📅 ${n.date}</span>
          </div>
        </div>

        <h3 class="text-sm font-bold text-forest mb-xs" style="line-height: 1.3;">${n.title}</h3>
        ${n.banglaTitle ? `<p class="text-xs text-muted mb-xs font-semibold">${n.banglaTitle}</p>` : ""}

        <p class="text-xs text-text mb-sm" style="line-height: 1.5;">${n.description}</p>

        <div class="flex items-center justify-between pt-xs" style="border-top: 1px dashed var(--color-border);">
          <span class="text-xs text-dim">Source: ${n.source}</span>
          <a href="${n.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <span>Official Portal →</span>
          </a>
        </div>
      </div>
    `).join("");
  };

  main.innerHTML = `
    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Search notice title, routine, result...", id: "notice-search-input" })}
    </div>

    <!-- Category Filter Chips -->
    <div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md" id="notice-cat-chips" style="scrollbar-width: none;">
      ${categories.map((c) => `
        <button class="badge ${c === "All" ? "badge-forest active" : "badge-sage"} n-cat-chip" data-cat="${c}">${c}</button>
      `).join("")}
    </div>

    <div id="notices-list-container"></div>
  `;

  main.querySelectorAll(".n-cat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      main.querySelectorAll(".n-cat-chip").forEach((c) => c.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".n-cat-chip").forEach((c) => c.classList.add("badge-sage"));
      chip.classList.remove("badge-sage");
      chip.classList.add("badge-forest", "active");
      selectedCat = chip.getAttribute("data-cat");
      renderNoticeCards();
    });
  });

  SearchBar.bindEvents(main, (q) => {
    searchQuery = q.trim();
    renderNoticeCards();
  }, "notice-search-input");

  renderNoticeCards();
}
