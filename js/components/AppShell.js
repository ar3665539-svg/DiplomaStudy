/**
 * AppShell v3 - Inline padding for bottom nav
 */

import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";

export const AppShell = {
  _mainView: null,
  _initialized: false,

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
        <div id="header-mount"></div>
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

    this.renderHeader({ showBack: false, showSettings: true });
    this.renderBottomNav();

    BottomNav.init();

    console.log("[AppShell v3] ✅ Mounted");
  },

  renderHeader(options = {}) {
    const mount = document.getElementById("header-mount");
    if (!mount) return;
    mount.innerHTML = Header.render(options);
    Header.bindEvents();
  },

  updateHeader(options = {}) {
    this.renderHeader({
      title: "",
      subtitle: "",
      showBack: false,
      showSearch: false,
      showSettings: true,
      centerTitle: true,
      ...options
    });
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