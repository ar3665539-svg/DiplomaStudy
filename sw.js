// sw.js - SELF DESTRUCT
// This SW unregisters itself and clears all caches.
// No fetch handler. No caching. Ever.

console.log("[SW] Self-destruct activated");

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then((clients) => {
        clients.forEach((c) => {
          try { c.navigate(c.url); } catch (e) {}
        });
      })
  );
});

// No fetch handler.
// No cache.
// Nothing.