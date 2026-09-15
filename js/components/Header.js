/**
 * DiplomaStudy - Header Component
 */

import { state } from "../core/state.js";
import { router } from "../core/router.js";

export const Header = {
  render({ title, subtitle, showBack = false, showSearch = true, showTheme = true } = {}) {
    const isDark = state.theme === "dark";
    
    if (showBack) {
      return `
        <header class="app-header">
          <div class="page-title-bar">
            <button class="back-btn" id="header-back-btn" aria-label="Go Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="flex-1 truncate">
              <h1 class="page-title-text truncate">${title || "DiplomaStudy"}</h1>
              ${subtitle ? `<p class="page-subtitle-text truncate">${subtitle}</p>` : ""}
            </div>
            <div class="header-actions">
              ${showSearch ? `
                <button class="header-icon-btn" id="header-search-btn" aria-label="Search" title="Search">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              ` : ""}
              ${showTheme ? `
                <button class="header-icon-btn" id="header-theme-btn" aria-label="Toggle Theme" title="Theme">
                  ${isDark ? `
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  ` : `
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  `}
                </button>
              ` : ""}
            </div>
          </div>
        </header>
      `;
    }

    return `
      <header class="app-header">
        <div class="header-brand">
          <div class="header-logo-icon">DS</div>
          <div class="header-title-box">
            <span class="header-app-name">DiplomaStudy</span>
            <span class="header-app-badge">BTEB Engineering</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="header-icon-btn" id="header-search-btn" aria-label="Search" title="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button class="header-icon-btn" id="header-theme-btn" aria-label="Toggle Theme" title="Theme">
            ${isDark ? `
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ` : `
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            `}
          </button>
          <button class="header-icon-btn" id="header-settings-btn" aria-label="Settings" title="Settings">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </header>
    `;
  },

  bindEvents(container) {
    container.querySelector("#header-back-btn")?.addEventListener("click", () => {
      router.back();
    });

    container.querySelector("#header-search-btn")?.addEventListener("click", () => {
      const searchModal = document.getElementById("search-overlay-modal");
      if (searchModal) {
        searchModal.style.display = "flex";
        document.getElementById("global-search-input")?.focus();
      }
    });

    container.querySelector("#header-theme-btn")?.addEventListener("click", () => {
      state.toggleTheme();
    });

    container.querySelector("#header-settings-btn")?.addEventListener("click", () => {
      router.navigate("#/settings");
    });
  }
};
