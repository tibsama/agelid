// Nom du cache
const CACHE_NAME = 'mon-cache-v1';

// Liste des fichiers à mettre en cache
const urlsToCache = [
  '/',
  '/index.html',
  '/images/mon-image.jpg'
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Ouverture du cache et ajout des fichiers');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker et suppression des anciens caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes et réponse avec le cache si possible
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si la ressource est dans le cache, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on fait une requête réseau
        return fetch(event.request);
      })
  );
});
