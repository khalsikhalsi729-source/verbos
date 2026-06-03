const CACHE_NAME = 'nexo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // الخطوط اللي مستعمل في الكود باش الموقع يبقى بنفس الديزاين أوفلاين
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=JetBrains+Mono:wght@400;600&family=Outfit:wght@300;400;500;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إيلا كان الملف مخبي، عطيه ليه، وإيلا لا جيبو من الأنترنيت
        return response || fetch(event.request);
      })
  );
});