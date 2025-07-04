
const CACHE_NAME = 'safaa-aldhin-v3';
const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v3';

// Resources to cache immediately
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// Install event - cache static resources
self.addEventListener('install', function(event) {
  console.log('Service Worker installing... v3');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        console.log('Caching static resources');
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, {cache: 'reload'});
        }));
      })
      .then(() => {
        console.log('Static cache complete');
      })
      .catch(function(error) {
        console.log('Cache addAll failed:', error);
        // Continue anyway, don't fail the install
      })
  );
  // Force the new service worker to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating... v3');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Cache cleanup complete');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip Supabase API calls - always go to network
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version if available
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream
          const responseToCache = response.clone();

          // Cache successful responses (but not all resources to avoid storage bloat)
          if (shouldCache(event.request.url)) {
            caches.open(DYNAMIC_CACHE)
              .then(function(cache) {
                console.log('Caching:', event.request.url);
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch(function(error) {
          console.log('Network failed for:', event.request.url, error);
          // Network failed, try to serve offline page or fallback
          if (event.request.destination === 'document') {
            return caches.match('/') || new Response('App is offline', { 
              status: 503,
              headers: { 'Content-Type': 'text/html' }
            });
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Helper function to determine what should be cached
function shouldCache(url) {
  // Cache static assets
  if (url.includes('.js') || url.includes('.css') || url.includes('.woff') || url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) {
    return true;
  }
  // Cache HTML pages
  if (url.endsWith('/') || url.includes('.html')) {
    return true;
  }
  return false;
}

// Handle background sync (for future use)
self.addEventListener('sync', function(event) {
  console.log('Background sync:', event.tag);
});

// Handle push notifications (for future use)
self.addEventListener('push', function(event) {
  console.log('Push notification received');
});

// Handle messages from the main thread
self.addEventListener('message', function(event) {
  console.log('SW received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
