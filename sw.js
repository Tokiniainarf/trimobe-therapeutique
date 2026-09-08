/**
 * SERVICE WORKER PWA — MANUELS DE THÉRAPEUTIQUE CLINIQUE & GÉRIATRIE 2026
 * Collection TRIMOBE & UMSP — Cache et Fonctionnement Hors-Ligne
 */

const CACHE_NAME = 'trimobe-therapeutique-v2';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './data-general.js',
  './data-geriatrie.js',
  './data-drugs.js',
  './calculators.js',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
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
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // En cas de perte de réseau sur les requêtes de navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
