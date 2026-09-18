/**
 * DiplomaStudy - Simple Hash Router
 */

let routes = {};
let currentRoute = "";
let cleanupFn = null;
let _initialized = false;

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

function handleRoute() {
  const hash = window.location.hash || "#/home";
  currentRoute = hash;

  // Cleanup previous page
  if (cleanupFn) {
    try { cleanupFn(); } catch (e) {}
    cleanupFn = null;
  }

  // Parse route + query
  const [pathPart, queryPart] = hash.split("?");
  const params = {};

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }

  // Find handler
  const handler = routes[pathPart];
  if (!handler) {
    console.warn(`[Router] No route for ${pathPart}, redirecting to home`);
    window.location.hash = "#/home";
    return;
  }

  // Update title
  import("../components/AppShell.js").then(({ AppShell }) => {
    try {
      AppShell.updateHeader({
        title: handler.title || "",
        subtitle: handler.subtitle || ""
      });
    } catch (e) {}
  }).catch(() => {});

  // Render
  const content = document.getElementById("main-view");
  if (content && handler.render) {
    content.innerHTML = "";
    try {
      const result = handler.render(content, params);
      if (result && typeof result.then === "function") {
        result.catch((err) => {
          console.error(`[Router] Render error for ${pathPart}:`, err);
          content.innerHTML = `
            <div style="padding:40px 20px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">⚠️</div>
              <div style="font-size:15px;font-weight:800;color:#DC2626;">Page load failed</div>
              <div style="font-size:12px;color:#84968B;margin-top:8px;">${escapeHtml(err.message)}</div>
            </div>
          `;
        });
      }
    } catch (err) {
      console.error(`[Router] Sync error for ${pathPart}:`, err);
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