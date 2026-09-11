/**
 * SERVICE WORKER PWA — MANUELS DE THÉRAPEUTIQUE CLINIQUE & GÉRIATRIE 2026
 * Collection TRIMOBE & UMSP — Cache et Fonctionnement Hors-Ligne
 *
 * Stratégie :
 * - Shell applicatif (HTML/JS/CSS/manifest) : network-first, cache en secours
 * - Navigation hors-ligne : fallback index.html
 * - Install résilient (un asset en échec n’abandonne pas tout le cache)
 */

const CACHE_NAME = 'trimobe-therapeutique-v4';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './data-general.js',
  './data-geriatrie.js',
  './data-drugs.js',
  './calculators.js',
  './app.js',
  './manifest.json',
  './icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.all(
        ASSETS.map(url =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {
            // Un asset manquant ne doit pas faire échouer l’installation
          })
        )
      );
      await self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Cross-origin (fonts Google, etc.) : cache-first après succès, sinon réseau
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }))
    );
    return;
  }

  // Navigation : network-first (contenu médical à jour), fallback offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put('./index.html', clone));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Assets applicatifs : network-first pour éviter un cache médical périmé
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
