/**
 * DiplomaStudy - AppShell (Master Frame)
 */

import { Header } from "./Header.js";
import { BottomNav } from "./BottomNav.js";
import { router } from "../core/router.js";
import { events } from "../core/events.js";
import { attachComingSoonHandlers } from "../core/comingSoonHelper.js";

export const AppShell = {
  init() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    appEl.innerHTML = `
      <div id="app-header-slot"></div>
      <main class="app-main animate-fade-in" id="app-main-view"></main>
      <div id="app-bottom-nav-slot"></div>
    `;

    this.updateBottomNav();

    events.on("state:routeChange", () => {
      this.updateBottomNav();
      // Re-attach coming soon handlers after route change
      setTimeout(() => {
        const nav = document.getElementById("app-bottom-nav-slot");
        if (nav) attachComingSoonHandlers(nav);
      }, 0);
    });

    // Initial attach
    setTimeout(() => {
      const nav = document.getElementById("app-bottom-nav-slot");
      if (nav) attachComingSoonHandlers(nav);
    }, 0);
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
      attachComingSoonHandlers(slot);
    }
  },

  getMainView() {
    return document.getElementById("app-main-view");
  }
};