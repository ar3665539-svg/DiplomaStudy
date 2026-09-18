/**
 * DiplomaStudy - Simple Hash Router v2
 * Adds route token to prevent async race conditions
 */

let routes = {};
let currentRoute = "";
let cleanupFn = null;
let _initialized = false;
let _routeToken = 0;

export function initRouter(routesMap) {
  routes = routesMap;
  window.addEventListener("hashchange", handleRoute);
  if (!window.location.hash) {
    window.location.hash = "#/home";
  } else {
    handleRoute();
  }
  _initialized = true;
}

// Export so pages can check if they're still the active route
export function isRouteActive(token) {
  return token === _routeToken;
}

export function getRouteToken() {
  return _routeToken;
}

function handleRoute() {
  const hash = window.location.hash || "#/home";
  currentRoute = hash;
  const myToken = ++_routeToken; // invalidate any in-flight async work

  if (cleanupFn) {
    try { cleanupFn(); } catch (e) {}
    cleanupFn = null;
  }

  const [pathPart, queryPart] = hash.split("?");
  const params = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }

  const handler = routes[pathPart];
  if (!handler) {
    console.warn("[Router] No route for " + pathPart + ", redirecting to home");
    window.location.hash = "#/home";
    return;
  }

  import("../components/AppShell.js").then(({ AppShell }) => {
    try {
      AppShell.updateHeader({
        title: handler.title || "",
        subtitle: handler.subtitle || ""
      });
    } catch (e) {}
  }).catch(() => {});

  const content = document.getElementById("main-view");
  if (content && handler.render) {
    content.innerHTML = "";
    try {
      const result = handler.render(content, params, myToken);
      if (result && typeof result.then === "function") {
        result.catch((err) => {
          if (!isRouteActive(myToken)) return; // silent — user navigated away
          console.error("[Router] Render error for " + pathPart + ":", err);
          content.innerHTML =
            '<div style="padding:40px 20px;text-align:center;">' +
              '<div style="font-size:48px;margin-bottom:12px;">!</div>' +
              '<div style="font-size:15px;font-weight:800;color:#DC2626;">Page load failed</div>' +
              '<div style="font-size:12px;color:#84968B;margin-top:8px;">' + escapeHtml(err.message) + '</div>' +
            '</div>';
        });
      }
    } catch (err) {
      console.error("[Router] Sync error for " + pathPart + ":", err);
    }
    window.scrollTo(0, 0);
  }
}

export function navigate(route) {
  if (!route.startsWith("#")) route = "#" + route;
  window.location.hash = route;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function register(path, renderFn) {
  routes[path] = { render: renderFn, title: "", subtitle: "" };
}

export const router = {
  register: (path, renderFn) => {
    if (typeof renderFn === "function") {
      routes[path] = { render: renderFn };
    } else if (typeof renderFn === "object" && typeof renderFn.render === "function") {
      routes[path] = renderFn;
    }
  },
  navigate,
  getCurrentRoute,
  init: () => {
    if (!_initialized) {
      initRouter(routes);
    } else {
      handleRoute();
    }
  },
  routes,
  get handlers() { return routes; }
};

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default router;