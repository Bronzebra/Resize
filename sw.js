self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('imgtool-v1').then(cache => cache.addAll([
    './',
    './index.html',
    './manifest.webmanifest',
    './icon-192.png',
    './icon-512.png'
  ])));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // only handle same-origin
  if (new URL(req.url).origin === location.origin) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open('imgtool-v1').then(cache => cache.put(req, copy));
      return res;
    }).catch(() => caches.match('./index.html'))));
  }
});