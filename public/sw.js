const CACHE_NAME = 'avihab-cache-v3';

// Початковий кеш
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Чистимо старі кеші
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

/**
 * Runtime кешування:
 * - якщо файл є в кеші → повертаємо кеш
 * - якщо ні → пробуємо з мережі
 * - якщо офлайн → fallback на index.html (для SPA)
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // fallback лише для SPA-навігації
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // fallback для картинок (якщо хочеш)
          // if (event.request.destination === 'image') {
          //   return caches.match('/icon-192.png');
          // }
        });
    })
  );
});
