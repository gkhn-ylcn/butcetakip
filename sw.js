const CACHE_NAME = 'butce-takip-v11';
// Önbelleğe alınacak dosyalar (Uygulamanın çalışması için şart olanlar)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-512.png'
];

// Service Worker Yükleme: Dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Dosyalar önbelleğe alınıyor...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktivasyon: Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Eski önbellek temizleniyor:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch: İnternet olmasa bile önbellekten getir
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Önbellekte varsa onu döndür, yoksa ağa git
      return response || fetch(event.request);
    })
  );
});
