// Incrementa la versione quando modifichi i file, così la cache viene rinnovata
const CACHE_NAME = "nfc-tool-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./vendor/water.min.css",
  "./app.css",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  // skipWaiting solo a shell copiata: attivarsi prima significherebbe servire
  // una cache ancora incompleta
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first per le navigazioni (così vedi subito gli aggiornamenti),
// cache-first per il resto; in entrambi i casi funziona offline.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match("./index.html")))
    );
    return;
  }

  // La ricerca è limitata alla cache di questa versione: caches.match() senza
  // nome guarda in tutte le cache e, finché la vecchia non è stata cancellata,
  // restituirebbe i file della versione precedente.
  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.match(req))
      .then((cached) => cached || fetch(req))
  );
});
