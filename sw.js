// Service worker: ține cartea (criptată) în telefon, ca să meargă și fără internet.
var V = 'carte-06920c8e88';
var CORE = ["./", "index.html", "book.enc", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
var MEDIA = ["img/01.webp.enc", "img/10.webp.enc", "img/163.webp.enc", "img/173.webp.enc", "img/174.webp.enc", "img/18.webp.enc", "img/181.webp.enc", "img/204.webp.enc", "img/210.webp.enc", "img/27.webp.enc", "img/33.webp.enc", "img/37.webp.enc", "img/46.webp.enc", "img/50.webp.enc", "img/66.webp.enc", "img/70.webp.enc", "img/76.webp.enc", "ill/ch01.webp.enc", "ill/ch02.webp.enc", "ill/ch03.webp.enc", "ill/ch04.webp.enc", "ill/ch05.webp.enc", "ill/ch06.webp.enc", "ill/ch07.webp.enc", "ill/ch08.webp.enc", "ill/ch09.webp.enc", "ill/ch10.webp.enc", "ill/ch11.webp.enc", "ill/ch12.webp.enc", "ill/ch13.webp.enc", "ill/ch14.webp.enc", "ill/ch15.webp.enc", "ill/ch16.webp.enc", "ill/ch17.webp.enc", "ill/ch18.webp.enc", "ill/ch19.webp.enc", "ill/ch20.webp.enc", "ill/ch21.webp.enc", "ill/ch22.webp.enc", "ill/ch23.webp.enc", "ill/cover.webp.enc", "ill/s-calculator.webp.enc", "ill/s-camara.webp.enc", "ill/s-clasament.webp.enc", "ill/s-costuri.webp.enc", "ill/s-cuprins.webp.enc", "ill/s-frigider.webp.enc", "ill/s-ghid.webp.enc", "ill/s-magazine.webp.enc", "ill/s-mealprep.webp.enc", "ill/s-meniu.webp.enc", "ill/s-planificator.webp.enc", "ill/s-provocare.webp.enc", "ill/s-ramas.webp.enc", "ill/s-sfaturi.webp.enc", "ill/s-volum.webp.enc", "ill/st-1-0.webp.enc", "ill/st-1-2a.webp.enc", "ill/st-1-2b.webp.enc", "ill/st-162-0.webp.enc", "ill/st-162-1.webp.enc", "ill/st-162-2.webp.enc", "ill/st-163-0.webp.enc", "ill/st-163-1.webp.enc", "ill/st-163-2.webp.enc", "ill/st-173-0.webp.enc", "ill/st-173-1.webp.enc", "ill/st-173-2.webp.enc", "ill/st-174-0.webp.enc", "ill/st-174-1.webp.enc", "ill/st-174-2.webp.enc", "ill/st-18-0.webp.enc", "ill/st-18-1.webp.enc", "ill/st-18-3.webp.enc", "ill/st-181-0.webp.enc", "ill/st-181-1.webp.enc", "ill/st-181-2.webp.enc", "ill/st-204-1.webp.enc", "ill/st-204-2.webp.enc", "ill/st-204-3.webp.enc", "ill/st-50-1.webp.enc", "ill/st-50-2.webp.enc", "ill/st-50-3.webp.enc", "ill/st-76-0.webp.enc", "ill/st-76-1.webp.enc", "ill/st-76-2.webp.enc", "vid/v152.mp4.enc", "vid/v162.mp4.enc", "vid/v163.mp4.enc", "vid/v173.mp4.enc", "vid/v174.mp4.enc", "vid/v181.mp4.enc", "vid/v204.mp4.enc", "vid/v210.mp4.enc"];
self.addEventListener('install', function (ev) {
  ev.waitUntil(caches.open(V).then(function (c) {
    // întâi ce trebuie ca să se deschidă, apoi pozele, fără să blocheze instalarea dacă una nu vine
    return c.addAll(CORE).then(function () { MEDIA.forEach(function (u) { c.add(u).catch(function () {}); }); });
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (ev) {
  ev.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (ev) {
  var req = ev.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  var isMedia = /\.(webp|mp4)\.enc$/.test(req.url) || /\.png$/.test(req.url);
  if (isMedia) {
    // pozele nu se schimbă: din telefon întâi
    ev.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req).then(function (r) { var cp = r.clone(); if (r.ok) caches.open(V).then(function (c) { c.put(req, cp); }); return r; }); }));
  } else {
    // pagina și cartea: de pe internet întâi (ca să vină versiunile noi), din telefon când nu e semnal
    ev.respondWith(fetch(req).then(function (r) { var cp = r.clone(); if (r.ok) caches.open(V).then(function (c) { c.put(req, cp); }); return r; }).catch(function () { return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('index.html'); }); }));
  }
});
