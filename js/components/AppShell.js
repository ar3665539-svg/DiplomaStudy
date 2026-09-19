/**
 * AppShell - Root shell with theme-aware sticky header
 */

import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";

// Theme-aware background helper
function getHeaderBackground() {
  try {
    var html = document.documentElement;
    var body = document.body;
    var theme = html.getAttribute("data-theme");

    // Try CSS variables first (in case they exist)
    var cs = window.getComputedStyle(html);
    var v = cs.getPropertyValue("--bg-base") ||
            cs.getPropertyValue("--bg-primary") ||
            cs.getPropertyValue("--background") ||
            cs.getPropertyValue("--color-bg");
    if (v && v.trim()) return v.trim();

    // Then read computed body bg
    var bgb = window.getComputedStyle(body).backgroundColor;
    if (bgb && bgb !== "rgba(0, 0, 0, 0)" && bgb !== "transparent") return bgb;

    // Then html bg
    var hbg = window.getComputedStyle(html).backgroundColor;
    if (hbg && hbg !== "rgba(0, 0, 0, 0)" && hbg !== "transparent") return hbg;

    // Fallback based on theme attribute
    return theme === "dark" ? "#101712" : "#FAF8F3";
  } catch (e) {
    return "#FAF8F3";
  }
}

export const AppShell = {
  _mainView: null,
  _initialized: false,
  _currentHash: "",
  _themeObserver: null,

  init() {
    if (this._initialized) return;
    this._initialized = true;

    const appRoot = document.getElementById("app");
    if (!appRoot) {
      console.error("[AppShell] #app not found");
      return;
    }

    appRoot.innerHTML = `
      <div class="app-shell" style="display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
        <div id="header-mount" style="
          position: sticky;
          top: 0;
          z-index: 50;
          background: #FAF8F3;
        "></div>
        <main class="app-main" id="main-view" style="
          flex: 1;
          padding: 16px;
          padding-bottom: 96px;
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
          animation: fadeIn 0.3s ease;
        "></main>
        <div id="bottom-nav-mount"></div>
      </div>
    `;

    this._mainView = document.getElementById("main-view");

    this.renderHeader({ showBack: false, showSettings: true, showSearch: true });
    this.renderBottomNav();

    BottomNav.init();

    // Apply theme-aware background now and on theme change
    this._applyHeaderBg();
    this._watchTheme();

    window.addEventListener("hashchange", () => {
      this._currentHash = (window.location.hash || "#/home").split("?")[0];
    });

    this._currentHash = (window.location.hash || "#/home").split("?")[0];

    console.log("[AppShell] Mounted");
  },

  _applyHeaderBg() {
    var mount = document.getElementById("header-mount");
    if (!mount) return;
    var bg = getHeaderBackground();
    if (bg) mount.style.background = bg;
  },

  _watchTheme() {
    // Observe data-theme attribute on <html> for changes
    try {
      if (this._themeObserver) this._themeObserver.disconnect();
      var self = this;
      this._themeObserver = new MutationObserver(function () {
        self._applyHeaderBg();
      });
      this._themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"]
      });
    } catch (e) {}
  },

  renderHeader(options = {}) {
    const mount = document.getElementById("header-mount");
    if (!mount) return;
    mount.innerHTML = Header.render(options);
    Header.bindEvents();
    // Reapply background in case theme changed
    var bg = getHeaderBackground();
    if (bg) mount.style.background = bg;
  },

  updateHeader(options = {}) {
    if (options.expectedHash) {
      const currentHash = (window.location.hash || "#/home").split("?")[0];
      const expected = String(options.expectedHash).split("?")[0];
      if (currentHash !== expected) {
        return;
      }
    }

    const { expectedHash, ...headerOptions } = options;

    this.renderHeader({
      title: "",
      subtitle: "",
      showBack: false,
      showSearch: true,
      showSettings: true,
      showTheme: true,
      centerTitle: true,
      ...headerOptions
    });
  },

  updateTitle(title, subtitle) {
    try {
      Header.updateTitle(title || "", subtitle || "");
    } catch (e) {}
  },

  renderBottomNav() {
    const mount = document.getElementById("bottom-nav-mount");
    if (!mount) return;
    mount.innerHTML = BottomNav.render();
  },

  getMainView() {
    if (!this._mainView) this._mainView = document.getElementById("main-view");
    return this._mainView;
  },

  scrollToTop(smooth = false) {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });
  },

  transitionPage() {
    const main = this.getMainView();
    if (!main) return;
    main.style.opacity = "0";
    main.style.transform = "translateY(6px)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        main.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        main.style.opacity = "1";
        main.style.transform = "translateY(0)";
        setTimeout(() => { main.style.transition = ""; }, 300);
      });
    });
  }
};