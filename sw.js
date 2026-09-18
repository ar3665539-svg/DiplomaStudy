/**
 * DiplomaStudy - Service Worker (Offline Support)
 * Version 9 - cache bump to force refresh
 */

const CACHE_VERSION = "diplomastudy-v9";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Static assets to pre-cache
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/reset.css",
  "./css/global.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/civil.css",
  "./css/onboarding.css",
  "./css/selection-modal.css",
  "./css/content.css",
  "./css/responsive.css",
  "./js/main.js",
  "./js/core/supabase.js",
  "./js/core/router.js",
  "./js/core/storage.js",
  "./js/services/api.js",
  "./js/components/AppShell.js",
  "./js/components/Header.js",
  "./js/components/BottomNav.js",
  "./js/components/Toast.js"
];

// INSTALL
self.addEventListener("install", (event) => {
  console.log("[SW] Installing v9...");
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn("[SW] Precache partial fail:", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating v9...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.hostname.includes("supabase.co")) return;
  if (!url.protocol.startsWith("http")) return;

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

// STRATEGIES
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response("", { status: 408, statusText: "Offline" });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && request.method === "GET") {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      const fallback = await caches.match("./index.html");
      if (fallback) return fallback;
    }

    return new Response(
      JSON.stringify({ error: "Offline" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

// MESSAGE
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data === "CLEAR_CACHE") {
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    );
  }
});

console.log("[SW] Loaded v9");