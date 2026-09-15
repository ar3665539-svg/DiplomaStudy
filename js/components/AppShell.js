/**
 * DiplomaStudy - AppShell Component
 * Master frame containing Header, Main View, BottomNav, and Global Modals
 */

import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";
import { globalSearch } from "../services/searchService.js";
import { router } from "../core/router.js";
import { events } from "../core/events.js";

export const AppShell = {
  init() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    appEl.innerHTML = `
      <div id="app-header-slot"></div>
      <main class="app-main animate-fade-in" id="app-main-view"></main>
      <div id="app-bottom-nav-slot"></div>

      <!-- Global Search Overlay -->
      <div id="search-overlay-modal" class="modal-overlay" style="display: none; align-items: flex-start; padding-top: 50px;">
        <div class="modal-content animate-fade-in" style="border-radius: var(--radius-lg); max-height: 80vh;">
          <div class="modal-header">
            <h3 class="modal-title">Search DiplomaStudy</h3>
            <button class="header-icon-btn" id="close-search-overlay" aria-label="Close search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="p-md" style="border-bottom: 1px solid var(--color-border);">
            <div class="search-container" style="margin-bottom: 0;">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                id="global-search-input" 
                class="search-input" 
                placeholder="Type keywords (e.g., Ohm, Matrix, C code, SFD, ETP)..."
              />
            </div>
          </div>
          <div class="modal-body" id="search-results-box" style="padding: 12px;">
            <p class="text-xs text-muted text-center p-md">Type at least 2 letters to search subjects, questions, formulas, jobs & notices.</p>
          </div>
        </div>
      </div>
    `;

    this._bindSearchModal();
    this.updateBottomNav();

    // Re-render bottom nav on route changes
    events.on("state:routeChange", () => {
      this.updateBottomNav();
    });

    events.on("state:themeChange", () => {
      this.updateBottomNav();
    });
  },

  updateHeader(headerConfig) {
    const slot = document.getElementById("app-header-slot");
    if (slot) {
      slot.innerHTML = Header.render(headerConfig);
      Header.bindEvents(slot);
    }
  },

  updateBottomNav() {
    const slot = document.getElementById("app-bottom-nav-slot");
    if (slot) {
      slot.innerHTML = BottomNav.render();
    }
  },

  getMainView() {
    return document.getElementById("app-main-view");
  },

  _bindSearchModal() {
    const overlay = document.getElementById("search-overlay-modal");
    const closeBtn = document.getElementById("close-search-overlay");
    const input = document.getElementById("global-search-input");
    const resultsBox = document.getElementById("search-results-box");

    const hide = () => {
      if (overlay) overlay.style.display = "none";
    };

    closeBtn?.addEventListener("click", hide);
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) hide();
    });

    input?.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      if (q.length < 2) {
        if (resultsBox) resultsBox.innerHTML = `<p class="text-xs text-muted text-center p-md">Type at least 2 letters to search...</p>`;
        return;
      }

      const results = globalSearch(q);
      if (results.length === 0) {
        if (resultsBox) resultsBox.innerHTML = `<p class="text-xs text-muted text-center p-md">No results found for "${q}".</p>`;
        return;
      }

      if (resultsBox) {
        resultsBox.innerHTML = results.slice(0, 10).map((item) => `
          <div class="card card-interactive mb-xs p-sm search-result-item" data-route="${item.route}" style="border-radius: var(--radius-sm);">
            <div class="flex items-center justify-between">
              <span class="badge badge-forest" style="font-size: 10px;">${item.type}</span>
              <span class="text-xs text-dim">${item.subtitle || ""}</span>
            </div>
            <p class="text-sm font-semibold text-text mt-xs">${item.title}</p>
          </div>
        `).join("");

        resultsBox.querySelectorAll(".search-result-item").forEach((el) => {
          el.addEventListener("click", () => {
            const route = el.getAttribute("data-route");
            hide();
            if (route) router.navigate(route);
          });
        });
      }
    });
  }
};
