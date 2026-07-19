const CACHE_NAME = 'personalos-cache-v12';
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
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
  const url = new URL(event.request.url);

  // API - Network First
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Icons & Fonts - Cache First
  if (url.pathname.includes('icon-') || event.request.destination === 'font' || url.pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Static Assets (CSS, JS) - Cache First
  if (event.request.destination === 'style' || event.request.destination === 'script' || url.pathname.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Images - Stale While Revalidate
  if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        }).catch(() => {});
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // HTML / Default - Network First
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          if (event.request.mode === 'navigate' || event.request.destination === 'document') {
            return caches.match('./offline.html');
          }
        });
      })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Simulate background sync process
      new Promise((resolve) => {
        console.log('Background Syncing triggered...');
        // Here we would typically read from IndexedDB and send data to server
        setTimeout(() => {
          console.log('Background Sync complete');
          // Notify clients
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ type: 'SYNC_COMPLETE' }));
          });
          resolve();
        }, 1000);
      })
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
