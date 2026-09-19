// sw.js - INSTALL ONLY
// Provides install support without caching.
// All requests go to network. No cache.

var SW_VERSION = "install-only-v1";

self.addEventListener("install", function (event) {
  console.log("[SW] Installing " + SW_VERSION);
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("[SW] Activating " + SW_VERSION);
  event.waitUntil(
    // Clear any old caches that might exist
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// Fetch handler — but NO cache. Just pass through.
// This is required for the app to be installable.
self.addEventListener("fetch", function (event) {
  var request = event.request;

  // Only handle GET
  if (request.method !== "GET") return;

  // Skip non-http
  if (!request.url.startsWith("http")) return;

  // Let the browser handle it normally
  // But we need a fetch handler to be installable, so we respondWith(fetch(request))
  event.respondWith(
    fetch(request).catch(function () {
      // Network failed (offline). Show friendly page for navigation.
      if (request.mode === "navigate" || request.destination === "document") {
        return new Response(
          '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>Offline</title><style>' +
          'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#F7F5EF;color:#1C3E2C;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center;}' +
          '.box{max-width:340px;}h1{font-size:22px;font-weight:900;margin:0 0 12px;}p{font-size:14px;color:#57675D;line-height:1.6;margin:0 0 20px;}' +
          'button{padding:14px 24px;background:#1C3E2C;color:#FFFFFF;border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;}' +
          '</style></head><body><div class="box">' +
          '<div style="font-size:64px;margin-bottom:16px;">\uD83D\uDCF6</div>' +
          '<h1>\u0986\u09AA\u09A8\u09BF \u0985\u09AB\u09B2\u09BE\u0987\u09A8</h1>' +
          '<p>\u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F \u09B8\u0982\u09AF\u09CB\u0997 \u09A8\u09C7\u0987\u0964 \u0995\u09C3\u09AA\u09DF\u09BE \u0995\u09B0\u09C7 \u09B8\u0982\u09AF\u09CB\u0997 \u0995\u09B0\u09C7 \u0986\u09AC\u09BE\u09B0 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964</p>' +
          '<button onclick="location.reload()">Retry</button>' +
          '</div></body></html>',
          {
            status: 503,
            statusText: "Offline",
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }
      // For non-navigation, just fail
      return new Response("", { status: 503, statusText: "Offline" });
    })
  );
});

console.log("[SW] " + SW_VERSION + " loaded");