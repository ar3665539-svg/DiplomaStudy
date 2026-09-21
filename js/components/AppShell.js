/**
 * AppShell - Immersive mode support (hides header+nav on #/ai)
 */

import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";

function isImmersiveRoute() {
  try {
    var hash = (window.location.hash || "#/home").split("?")[0];
    return hash === "#/ai";
  } catch (e) { return false; }
}

function applyImmersiveMode() {
  var immersive = isImmersiveRoute();
  var headerMount = document.getElementById("header-mount");
  var navMount = document.getElementById("bottom-nav-mount");
  var mainView = document.getElementById("main-view");

  if (immersive) {
    document.body.classList.add("ds-immersive-mode");
    if (headerMount) headerMount.style.display = "none";
    if (navMount) navMount.style.display = "none";
    if (mainView) {
      mainView.style.padding = "0";
      mainView.style.paddingBottom = "0";
      mainView.style.maxWidth = "100%";
    }
  } else {
    document.body.classList.remove("ds-immersive-mode");
    if (headerMount) headerMount.style.display = "";
    if (navMount) navMount.style.display = "";
    if (mainView) {
      mainView.style.padding = "16px";
      mainView.style.paddingBottom = "96px";
      mainView.style.maxWidth = "680px";
    }
  }
}

export var AppShell = {
  _mainView: null,
  _initialized: false,
  _currentHash: "",

  init: function () {
    if (this._initialized) return;
    this._initialized = true;

    var appRoot = document.getElementById("app");
    if (!appRoot) {
      console.error("[AppShell] #app not found");
      return;
    }

    // Theme-aware styles
    if (!document.getElementById("ds-shell-style")) {
      var st = document.createElement("style");
      st.id = "ds-shell-style";
      st.textContent =
        "#header-mount {" +
          "position: sticky;" +
          "top: 0;" +
          "z-index: 50;" +
          "background: var(--color-bg, #F7F5EF);" +
          "transition: background 0.25s ease;" +
        "}" +
        "#header-mount .app-header {" +
          "background: transparent !important;" +
          "backdrop-filter: none !important;" +
          "-webkit-backdrop-filter: none !important;" +
          "box-shadow: none !important;" +
          "border-bottom: 1px solid var(--color-border-subtle, rgba(0,0,0,0.06)) !important;" +
        "}" +
        "#header-mount .app-header.scrolled {" +
          "box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;" +
        "}" +
        "[data-theme='dark'] #header-mount .app-header.scrolled {" +
          "box-shadow: 0 2px 12px rgba(0,0,0,0.4) !important;" +
        "}" +
        "body.ds-immersive-mode { overflow: hidden; }" +
        "body.ds-immersive-mode .app-main { animation: none !important; }";
      document.head.appendChild(st);
    }

    appRoot.innerHTML =
      '<div class="app-shell" style="display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">' +
        '<div id="header-mount"></div>' +
        '<main class="app-main" id="main-view" style="flex:1;padding:16px;padding-bottom:96px;max-width:680px;width:100%;margin:0 auto;animation:fadeIn 0.3s ease;"></main>' +
        '<div id="bottom-nav-mount"></div>' +
      '</div>';

    this._mainView = document.getElementById("main-view");

    this.renderHeader({ showBack: false, showSettings: true, showSearch: true });
    this.renderBottomNav();

    BottomNav.init();

    window.addEventListener("hashchange", function () {
      var shell = AppShell;
      shell._currentHash = (window.location.hash || "#/home").split("?")[0];
      applyImmersiveMode();
    });

    this._currentHash = (window.location.hash || "#/home").split("?")[0];
    applyImmersiveMode();

    console.log("[AppShell] Mounted");
  },

  renderHeader: function (options) {
    options = options || {};
    var mount = document.getElementById("header-mount");
    if (!mount) return;
    mount.innerHTML = Header.render(options);
    Header.bindEvents();
  },

  updateHeader: function (options) {
    options = options || {};
    if (options.expectedHash) {
      var currentHash = (window.location.hash || "#/home").split("?")[0];
      var expected = String(options.expectedHash).split("?")[0];
      if (currentHash !== expected) return;
    }

    var headerOptions = {};
    for (var k in options) {
      if (k !== "expectedHash") headerOptions[k] = options[k];
    }

    this.renderHeader(Object.assign({
      title: "",
      subtitle: "",
      showBack: false,
      showSearch: true,
      showSettings: true,
      showTheme: true,
      centerTitle: true
    }, headerOptions));
  },

  updateTitle: function (title, subtitle) {
    try {
      Header.updateTitle(title || "", subtitle || "");
    } catch (e) {}
  },

  renderBottomNav: function () {
    var mount = document.getElementById("bottom-nav-mount");
    if (!mount) return;
    mount.innerHTML = BottomNav.render();
  },

  getMainView: function () {
    if (!this._mainView) this._mainView = document.getElementById("main-view");
    return this._mainView;
  },

  scrollToTop: function (smooth) {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });
  },

  transitionPage: function () {
    var main = this.getMainView();
    if (!main) return;
    main.style.opacity = "0";
    main.style.transform = "translateY(6px)";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        main.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        main.style.opacity = "1";
        main.style.transform = "translateY(0)";
        setTimeout(function () { main.style.transition = ""; }, 300);
      });
    });
  }
};

// Export helper for pages that want to re-check immersive on load
export function syncImmersiveMode() {
  applyImmersiveMode();
}