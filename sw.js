const CACHE_NAME = 'nexo-cache-v4';

// حيدنا /index.html حيت Vercel كيدير ليها Redirect وهادشي اللي كان كيخسر لينا التخزين
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('كايخبي الملفات...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('فشل التخزين:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('كيمسح الكاش القديم...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // إيلا كان الملف مخبي عطيه ليه، إيلا لا جيبو من الأنترنيت
      return response || fetch(event.request).catch(() => {
        // إيلا تقطعات الكونيكسيون وماقدرش يجيبو، ديما رجعو للصفحة الرئيسية
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});