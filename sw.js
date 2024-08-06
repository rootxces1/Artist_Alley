const CACHE_NAME = 'my-cache';
const OFFLINE_URL = './html/offline.html';
const URLs_TO_CACHE = [
  './src/Untitled-9.png',
  './src/logo2.png',
  './src/monkey.gif',
  './css/headerstyle.css',
  './css/main-footer.css',
  OFFLINE_URL
];

// Install event - cache the necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLs_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Fetch event - serve cached files or fallback to offline page
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return the cached response if available
        }
        return fetch(event.request).catch(() => {
          // If the network fails, show the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          // For non-navigation requests, fallback to an empty response
          return new Response('', { status: 404 });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});