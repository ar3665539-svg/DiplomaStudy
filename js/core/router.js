/**
 * DiplomaStudy - Client-Side Hash Router
 * Supports direct routes, route parameters, and history navigation
 */

import { state } from "./state.js";
import { events } from "./events.js";

class Router {
  constructor() {
    this.routes = new Map();
    this.historyStack = [];
    this.currentPath = "#/home";
    this.params = {};
    
    window.addEventListener("hashchange", () => this._handleRoute());
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path, pushHistory = true) {
    if (pushHistory && this.currentPath !== path) {
      this.historyStack.push(this.currentPath);
    }
    window.location.hash = path;
  }

  back() {
    if (this.historyStack.length > 0) {
      const prev = this.historyStack.pop();
      window.location.hash = prev;
    } else {
      window.location.hash = "#/home";
    }
  }

  getRouteInfo() {
    const hash = window.location.hash || "#/home";
    const [pathPart, queryPart] = hash.split("?");
    const params = {};
    
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }
    
    return { path: pathPart, params };
  }

  init() {
    if (!window.location.hash) {
      window.location.hash = "#/home";
    } else {
      this._handleRoute();
    }
  }

  _handleRoute() {
    const { path, params } = this.getRouteInfo();
    this.currentPath = path;
    this.params = params;
    state.setRoute(path);

    const handler = this.routes.get(path);
    if (handler) {
      try {
        handler(params);
      } catch (err) {
        console.error(`[Router] Error rendering ${path}:`, err);
        this._renderError(path, err.message);
      }
    } else {
      // Fallback route
      const homeHandler = this.routes.get("#/home");
      if (homeHandler) {
        homeHandler(params);
      }
    }

    window.scrollTo(0, 0);
    events.emit("router:navigated", { path, params });
  }

  _renderError(path, message) {
    const main = document.querySelector(".app-main");
    if (main) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h2 class="empty-state-title">Something went wrong</h2>
          <p class="empty-state-desc">Could not render ${path}. Please try again.</p>
          <button class="btn btn-primary btn-sm" onclick="window.location.hash = '#/home'">Back to Home</button>
        </div>
      `;
    }
  }
}

export const router = new Router();
