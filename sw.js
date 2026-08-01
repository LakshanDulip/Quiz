self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('quizhub-v1').then(c => c.addAll([
      '/', '/index.html', '/data.json'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
