const CACHE_NAME = 'vlab-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/style.css',
  '/static/js/main.js',
  '/offline/',
];

// Install
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => response || caches.match('/offline/'))
    )
  );
});
