const CACHE = 'msb-v29';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/admin.css',
  './js/app.js',
  './js/data.js',
  './js/fb.js',
  './js/qrcode.min.js',
  './manifest.json',
  './img/msemen.jpg',
  './img/khobz.jpg',
  './img/baghrir.jpg',
  './img/briouat.jpg',
  './img/halwa3ra.jpg',
  './img/kers.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Les images: cache d'abord (rapide)
  if (/\.(png|jpe?g|webp|svg|ico|woff2?)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(r =>
        r || fetch(e.request).then(res => {
          const cp = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
          return res;
        })
      )
    );
    return;
  }

  // Pages + JS + CSS: RESEAU D'ABORD (toujours la version recente!)
  e.respondWith(
    fetch(e.request).then(res => {
      const cp = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp));
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))
    )
  );
});
