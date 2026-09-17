/* DiplomaStudy - Service Worker v2 */
const CACHE_NAME = 'diplomastudy-v2';
const RUNTIME_CACHE = 'diplomastudy-runtime-v2';

// ═══════════════════════════════════════════
// Precache Assets
// ═══════════════════════════════════════════
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/reset.css',
  './css/global.css',
  './css/layout.css',
  './css/components.css',
  './css/civil.css',
  './css/onboarding.css',
  './css/responsive.css',
  './js/main.js',
  './js/core/supabase.js',
  './js/services/api.js'
];

// ═══════════════════════════════════════════
// Install
// ═══════════════════════════════════════════
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Precache incomplete:', err);
        });
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// ═══════════════════════════════════════════
// Activate — Delete old caches
// ═══════════════════════════════════════════
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ═══════════════════════════════════════════
// Fetch — Network First for JS/HTML, Cache First for CSS
// ═══════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Skip Supabase API calls (don't cache API responses)
  if (url.hostname.includes('supabase')) {
    return;
  }

  const acceptHeader = event.request.headers.get('accept') || '';
  const isHTML = acceptHeader.includes('text/html');
  const isJS = url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs');
  const isCSS = url.pathname.endsWith('.css');
  const isJSON = url.pathname.endsWith('.json');

  // ═══════════════════════════════════════════
  // Network First for HTML, JS, JSON
  // (always get latest)
  // ═══════════════════════════════════════════
  if (isHTML || isJS || isJSON) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && isSameOrigin) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline — try cache
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (isHTML) return caches.match('./index.html');
            return new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // ═══════════════════════════════════════════
  // Cache First for CSS, fonts, images
  // ═══════════════════════════════════════════
  if (isCSS || url.pathname.match(/\.(woff2?|ttf|png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && isSameOrigin) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // ═══════════════════════════════════════════
  // Default — Stale While Revalidate
  // ═══════════════════════════════════════════
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200 && isSameOrigin) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// ═══════════════════════════════════════════
// Message handler — Force update
// ═══════════════════════════════════════════
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});