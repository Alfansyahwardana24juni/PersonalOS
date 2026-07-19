const CACHE_NAME = 'personalos-cache-v11';
const urlsToCache = [
  './',
  './index.html',
  './tasks.html',
  './calendar.html',
  './finance.html',
  './notes.html',
  './profile.html',
  './settings.html',
  './inbox.html',
  './css/style.css',
  './js/main.js',
  './js/crud.js',
  './js/tasks_app.js',
  './js/finance_app.js',
  './js/calendar_app.js',
  './js/command_palette.js',
  './js/dashboard_app.js',
  './logoputih.png',
  './logohitam.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Tell the active service worker to take control of the page immediately.
  event.waitUntil(self.clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Network-first strategy for HTML and JS files to ensure updates are seen
  if (event.request.url.includes('.html') || event.request.url.includes('.js') || event.request.url.includes('.css')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone and update cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first for images and other static assets
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(networkResponse => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return networkResponse;
          });
        })
    );
  }
});
