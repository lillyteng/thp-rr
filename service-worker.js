// THP RR service worker — auto-generated, do not edit by hand.
const VERSION = '2026-05-10.1778377360';
const CACHE = 'thp-rr-' + VERSION;
const PRECACHE_URLS = ['./', './index.html'];

self.addEventListener('install', event => {
  // Activate the new worker immediately instead of waiting for old tabs to close.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    // Drop any caches from prior versions.
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ),
    // Take control of any tabs that are already open.
    self.clients.claim(),
  ]));
});

// Stale-while-revalidate for app HTML: instant from cache, updates in the
// background. After install, the cache already contains the freshly fetched
// HTML, so reloads after activation see new content.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(event.request).then(cached => {
        const fresh = fetch(event.request).then(resp => {
          if (resp && resp.status === 200 && resp.type !== 'opaque') {
            cache.put(event.request, resp.clone());
          }
          return resp;
        }).catch(() => cached);
        return cached || fresh;
      })
    )
  );
});
