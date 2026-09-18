/**
 * Header - Modern glass header
 * + Brand on home / Back on inner pages
 * + Search + Theme + Settings (all working)
 */

import { router } from "../core/router.js";

// ═══════════════════════════════════════════
// THEME MANAGEMENT
// ═══════════════════════════════════════════
const THEME_KEY = "diplomastudy_theme";

function getCurrentTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch (e) { return "light"; }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#101712" : "#1C3E2C");
  }

  const toggleIcon = document.getElementById("theme-icon-svg");
  if (toggleIcon) {
    if (theme === "dark") {
      toggleIcon.innerHTML = `
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="12" y1="2" x2="12" y2="4"></line>
        <line x1="12" y1="20" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="4" y2="12"></line>
        <line x1="20" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
      `;
    } else {
      toggleIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }
}

function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {}
  applyTheme(next);
}

// ═══════════════════════════════════════════
// NAVIGATION HELPER — reliable
// ═══════════════════════════════════════════
function navigateTo(hash) {
  console.log("[Header] Navigating to:", hash);
  try {
    // Try router.navigate first (if available)
    if (router && typeof router.navigate === "function") {
      router.navigate(hash);
      // Verify navigation actually happened
      setTimeout(() => {
        if (window.location.hash !== hash) {
          console.log("[Header] Router didn't navigate, using direct hash");
          window.location.hash = hash;
        }
      }, 50);
    } else {
      window.location.hash = hash;
    }
  } catch (e) {
    console.warn("[Header] Navigation error:", e);
    window.location.hash = hash;
  }
}

// ═══════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════
export const Header = {
  render(options = {}) {
    const {
      title = "",
      subtitle = "",
      showBack = false,
      showSearch = false,
      showSettings = true,
      showTheme = true,
      centerTitle = true
    } = options;

    applyTheme(getCurrentTheme());

    // ═══ LEFT ═══
    let leftHtml = "";
    if (showBack) {
      leftHtml = `
        <button class="header-icon-btn" id="header-back-btn" type="button" aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      `;
    } else {
      leftHtml = `
        <div class="header-brand">
          <div class="header-brand-logo">DS</div>
          <div class="header-brand-text">
            <span class="header-brand-name">DiplomaStudy</span>
          </div>
        </div>
      `;
    }

    // ═══ CENTER ═══
    const centerHtml = `
      <div class="app-header-title ${centerTitle ? "centered" : "left"}">
        <span class="app-header-title-name" id="header-title">${title || ""}</span>
        <span class="app-header-title-sub" id="header-subtitle" style="${subtitle ? "" : "display:none;"}">${subtitle || ""}</span>
      </div>
    `;

    // ═══ RIGHT ═══
    const currentTheme = getCurrentTheme();
    const themeIcon = currentTheme === "dark"
      ? `<circle cx="12" cy="12" r="4"></circle>
         <line x1="12" y1="2" x2="12" y2="4"></line>
         <line x1="12" y1="20" x2="12" y2="22"></line>
         <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
         <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
         <line x1="2" y1="12" x2="4" y2="12"></line>
         <line x1="20" y1="12" x2="22" y2="12"></line>
         <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
         <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>`
      : `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

    let rightHtml = `<div class="header-actions">`;

    if (showSearch) {
      rightHtml += `
        <button class="header-icon-btn" id="header-search-btn" type="button" aria-label="Search">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      `;
    }

    if (showTheme) {
      rightHtml += `
        <button class="header-icon-btn" id="header-theme-btn" type="button" aria-label="Toggle theme">
          <svg id="theme-icon-svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${themeIcon}
          </svg>
        </button>
      `;
    }

    if (showSettings) {
      rightHtml += `
        <button class="header-icon-btn" id="header-settings-btn" type="button" aria-label="Settings">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      `;
    }

    rightHtml += `</div>`;

    if (!showSearch && !showTheme && !showSettings) {
      rightHtml = `<div style="width:40px;flex-shrink:0;"></div>`;
    }

    return `
      <header class="app-header" id="app-header">
        ${leftHtml}
        ${centerHtml}
        ${rightHtml}
      </header>
    `;
  },

  bindEvents() {
    console.log("[Header] Binding events...");

    // ═══ Back ═══
    const backBtn = document.getElementById("header-back-btn");
    if (backBtn) {
      const nb = backBtn.cloneNode(true);
      backBtn.parentNode.replaceChild(nb, backBtn);
      nb.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigateTo("#/home");
        }
      });
    }

    // ═══ Search ═══
    const searchBtn = document.getElementById("header-search-btn");
    if (searchBtn) {
      const nb = searchBtn.cloneNode(true);
      searchBtn.parentNode.replaceChild(nb, searchBtn);
      nb.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("[Header] Search clicked");
        navigateTo("#/search");
      });
      console.log("[Header] ✅ Search bound");
    } else {
      console.warn("[Header] Search button not found");
    }

    // ═══ Theme ═══
    const themeBtn = document.getElementById("header-theme-btn");
    if (themeBtn) {
      const nb = themeBtn.cloneNode(true);
      themeBtn.parentNode.replaceChild(nb, themeBtn);
      nb.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const svg = nb.querySelector("svg");
        if (svg) {
          svg.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
          svg.style.transform = "rotate(180deg) scale(0.8)";
          setTimeout(() => { svg.style.transform = ""; }, 300);
        }

        toggleTheme();
      });
      console.log("[Header] ✅ Theme bound");
    }

    // ═══ Settings ═══
    const settingsBtn = document.getElementById("header-settings-btn");
    if (settingsBtn) {
      const nb = settingsBtn.cloneNode(true);
      settingsBtn.parentNode.replaceChild(nb, settingsBtn);
      nb.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("[Header] Settings clicked");
        navigateTo("#/settings");
      });
      console.log("[Header] ✅ Settings bound");
    } else {
      console.warn("[Header] Settings button not found");
    }

    this.bindScrollListener();
  },

  bindScrollListener() {
    const header = document.getElementById("app-header");
    if (!header) return;

    if (window._headerScrollHandler) {
      window.removeEventListener("scroll", window._headerScrollHandler);
    }

    window._headerScrollHandler = () => {
      if (window.scrollY > 8) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };

    window.addEventListener("scroll", window._headerScrollHandler, { passive: true });
  },

  updateTitle(title, subtitle = "") {
    const titleEl = document.getElementById("header-title");
    const subtitleEl = document.getElementById("header-subtitle");

    if (titleEl) titleEl.textContent = title || "";

    if (subtitleEl) {
      if (subtitle) {
        subtitleEl.textContent = subtitle;
        subtitleEl.style.display = "";
      } else {
        subtitleEl.textContent = "";
        subtitleEl.style.display = "none";
      }
    }
  }
};

// Apply theme on load
applyTheme(getCurrentTheme());