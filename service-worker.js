/* ---------- CACHE VERSION ---------- */

const CACHE_NAME = "verthink-cache-v7";

/* ---------- FILES TO CACHE ---------- */

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/softskills_words.json",
  "/motivation_quotes.json",
  "/icon-192.png",
  "/icon-512.png"
];

/* ---------- INSTALL ---------- */

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );

  self.skipWaiting();

});

/* ---------- ACTIVATE ---------- */

self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();

});

/* ---------- FETCH ---------- */

self.addEventListener("fetch", (event) => {

  const request = event.request;

  /* 🚫 Ignore NON-GET requests (VERY IMPORTANT) */
  if (request.method !== "GET") return;

  /* 🚫 Ignore Firebase / external APIs */
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(

    caches.match(request).then((cachedResponse) => {

      /* ✅ Return from cache if exists */
      if (cachedResponse) {
        return cachedResponse;
      }

      /* 🌐 Else fetch from network */
      return fetch(request)
        .then((networkResponse) => {

          /* Safety check */
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          /* 💾 Save in cache */
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          /* Offline fallback */
          return caches.match("/index.html");
        });

    })

  );

});