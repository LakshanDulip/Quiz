// ============ SERVICE WORKER - QUIZ HUB ============
// Enhanced service worker with cache management, versioning, and update handling

const CACHE_NAME = 'quizhub-v2';
const RUNTIME_CACHE = 'quizhub-runtime-v2';
const VERSION = '2.0.0';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/data/science.json',
  '/data/maths.json',
  '/version.json',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Sinhala:wght@400;500;700&display=swap'
];

// Optional audio files
const OPTIONAL_ASSETS = [
  '/voice/15correct.mp3',
  '/voice/100score.mp3'
];

// ✅ External domains that should NOT be cached
const EXTERNAL_DOMAINS = [
  'ibb.co',
  'i.ibb.co',
  'imgur.com',
  'i.imgur.com',
  'cloudinary.com',
  'res.cloudinary.com',
  'images.unsplash.com',
  'plus.unsplash.com'
];

// Helper function to check if URL is external
function isExternalUrl(url) {
  const hostname = url.hostname;
  
  // Check against known external domains
  for (const domain of EXTERNAL_DOMAINS) {
    if (hostname.includes(domain)) return true;
  }
  
  // Check if it's not our own domain
  if (self.location.hostname && !hostname.includes(self.location.hostname)) {
    // Allow CDN fonts and icons
    if (hostname.includes('cdnjs.cloudflare.com')) return false;
    if (hostname.includes('fonts.googleapis.com')) return false;
    if (hostname.includes('fonts.gstatic.com')) return false;
    return true;
  }
  
  return false;
}

// Install event - pre-cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v' + VERSION);
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache critical assets
        await cache.addAll(PRECACHE_ASSETS);
        console.log('[SW] Critical assets cached successfully');
        
        // Cache optional assets (won't fail if missing)
        try {
          await cache.addAll(OPTIONAL_ASSETS);
          console.log('[SW] Optional assets cached');
        } catch (err) {
          console.log('[SW] Optional assets not available (will fetch on demand)');
        }
        
        // Force activation
        await self.skipWaiting();
      } catch (error) {
        console.error('[SW] Pre-cache failed:', error);
      }
    })()
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v' + VERSION);
  
  event.waitUntil(
    (async () => {
      try {
        // Get all cache names
        const cacheNames = await caches.keys();
        
        // Delete old caches
        const deletePromises = cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          });
        
        await Promise.all(deletePromises);
        
        // Claim all clients immediately
        await self.clients.claim();
        
        console.log('[SW] Activation complete');
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET') return;
  if (url.origin.includes('chrome-extension')) return;
  
  // ✅ Skip external URLs - let browser handle them directly
  if (isExternalUrl(url)) {
    console.log('[SW] Skipping external URL:', url.hostname);
    return; // Don't intercept, let browser fetch directly
  }
  
  // Handle different request types
  if (url.pathname.endsWith('.json')) {
    // JSON files - Network first with cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (url.pathname.endsWith('.png') || 
             url.pathname.endsWith('.jpg') || 
             url.pathname.endsWith('.jpeg') || 
             url.pathname.endsWith('.webp') || 
             url.pathname.endsWith('.svg') || 
             url.pathname.endsWith('.gif')) {
    // Images - Cache first with network update
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.ogg')) {
    // Audio files - Cache first
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.origin === 'https://cdnjs.cloudflare.com' || 
             url.origin === 'https://fonts.googleapis.com' || 
             url.origin === 'https://fonts.gstatic.com') {
    // External CDN resources - Cache first
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // HTML and other requests - Network first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network first strategy (for JSON and HTML)
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache the response if valid
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed, using cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If HTML request and no cache, return offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return new Response(
        '<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#0d1815;color:#f2f7ee;"><div style="text-align:center;"><h1>📡 Offline</h1><p>Please check your internet connection</p><button onclick="location.reload()" style="padding:10px 20px;border-radius:20px;background:#facc15;color:#000;border:none;cursor:pointer;">Retry</button></div></body></html>',
        {
          status: 503,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }
    
    throw error;
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background (stale-while-revalidate)
    fetch(request).then(response => {
      if (response && response.ok) {
        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(request, response);
        });
      }
    }).catch(() => {
      // Silently fail for background updates
    });
    
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    throw error;
  }
}

// Message handler for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0]?.postMessage({ success: true });
      });
      break;
      
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: VERSION });
      break;
      
    case 'UPDATE_CACHE':
      updateCache(payload?.urls || []).then(() => {
        event.ports[0]?.postMessage({ success: true });
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames.map(name => caches.delete(name));
  await Promise.all(deletePromises);
  console.log('[SW] All caches cleared');
}

// Update specific cache entries
async function updateCache(urls) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  const updatePromises = urls.map(async (url) => {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        await cache.put(url, response);
        console.log('[SW] Updated cache for:', url);
      }
    } catch (error) {
      console.warn('[SW] Failed to update cache for:', url, error);
    }
  });
  
  await Promise.all(updatePromises);
}

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Close' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Quiz Hub', options)
  );
});

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

// Check for updates
async function checkForUpdates() {
  try {
    const response = await fetch('/version.json', { cache: 'no-store' });
    const data = await response.json();
    
    if (data.version !== VERSION) {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          version: data.version
        });
      });
    }
  } catch (error) {
    console.error('[SW] Update check failed:', error);
  }
}

console.log('[SW] Quiz Hub Service Worker v' + VERSION + ' loaded');
