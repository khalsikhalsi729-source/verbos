const CACHE_NAME = 'nexo-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// هادشي كيفرض على Service Worker يتانصطالا فالبلاصة
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// هادشي كيمسح أي كاش قديم خاسر 
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// هادشي باش إيلا تقطعات الكونيكسيون يرجعك ديريكت لـ index.html
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});