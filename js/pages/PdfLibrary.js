/**
 * DiplomaStudy - PDF Library Page View
 */

import { AppShell } from "../components/AppShell.js";
import { pdfs } from "../../data/pdfs.js";
import { bookmarkService } from "../features/bookmark/bookmarkService.js";
import { PdfCard } from "../components/PdfCard.js";
import { SearchBar } from "../components/SearchBar.js";

export function renderPdfLibrary() {
  AppShell.updateHeader({
    title: "PDF Library",
    subtitle: "Books, Notes & Handouts",
    showBack: true,
    showSearch: true
  });

  const main = AppShell.getMainView();
  if (!main) return;

  const categories = [
    "All",
    "Hand Notes",
    "Notes",
    "Lab Manual",
    "Board Questions",
    "Syllabus",
    "Model Test"
  ];

  let selectedCat = "All";
  let searchQuery = "";

  const renderCards = () => {
    const container = main.querySelector("#pdf-list-container");
    if (!container) return;

    let filtered = pdfs;
    if (selectedCat !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.banglaTitle && p.banglaTitle.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📄</div>
          <h2 class="empty-state-title">No PDFs Found</h2>
          <p class="empty-state-desc">Try selecting another filter or clear search terms.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((pdf) => {
      const isBookmarked = bookmarkService.isBookmarked("pdfs", pdf.id);
      return PdfCard.render(pdf, { isBookmarked });
    }).join("");

    PdfCard.bindEvents(container, {
      onBookmark: (id, btn) => {
        const added = bookmarkService.toggle("pdfs", id);
        const svg = btn.querySelector("svg");
        if (svg) {
          svg.setAttribute("fill", added ? "var(--color-accent)" : "none");
          svg.setAttribute("stroke", added ? "var(--color-accent)" : "currentColor");
        }
      }
    });
  };

  main.innerHTML = `
    <div class="mb-sm">
      ${SearchBar.render({ placeholder: "Search PDF books, hand notes, manuals...", id: "pdf-search-input" })}
    </div>

    <!-- Category Chips -->
    <div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md" id="pdf-category-chips" style="scrollbar-width: none;">
      ${categories.map((c) => `
        <button class="badge ${c === "All" ? "badge-forest active" : "badge-sage"} pdf-cat-chip" data-cat="${c}">${c}</button>
      `).join("")}
    </div>

    <div id="pdf-list-container"></div>
  `;

  main.querySelectorAll(".pdf-cat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      main.querySelectorAll(".pdf-cat-chip").forEach((c) => c.classList.remove("badge-forest", "active"));
      main.querySelectorAll(".pdf-cat-chip").forEach((c) => c.classList.add("badge-sage"));
      chip.classList.remove("badge-sage");
      chip.classList.add("badge-forest", "active");
      selectedCat = chip.getAttribute("data-cat");
      renderCards();
    });
  });

  SearchBar.bindEvents(main, (q) => {
    searchQuery = q.trim();
    renderCards();
  }, "pdf-search-input");

  renderCards();
}
