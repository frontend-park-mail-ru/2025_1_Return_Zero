const version = '1.0.0'; // Version for cache management
const staticCache = 'STATIC_CACHE-' + version;
const mediaCache = 'MEDIA_CACHE-' + version; // Fixed cache name
const apiCache = 'API_CACHE-' + version;
const staticCacheExpiry = 60 * 60 * 24; // 24 hours
const mediaCacheExpiry = 60 * 60 * 2; // 2 hours in seconds

const workerHeader = "Worker-Cached-At";

const cacheFirstRoutes = [
    '^/$',
    '^/static/bundle.js$',
    '\.css$',
];


self.addEventListener('activate', async function(event) {
    console.log('Activating Service Worker', version);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete any cache that doesn't match our current version
                    if (cacheName.includes('CACHE') && !cacheName.includes(version)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Claiming control');
            return self.clients.claim();
        })
    );
});

self.addEventListener('install', async (event) => {
    console.log('Installing Service Worker', version);
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (event.request.method === 'GET' && cacheFirstRoutes.some(regex => url.pathname.match(regex))) {
        event.respondWith(handleRequestFirst(event.request));
    }
    else if (event.request.method === 'GET' && url.pathname.startsWith('/static/')) {
        event.respondWith(handleStaticFetch(event.request));
    }
    else if (event.request.method === 'GET' && url.origin === 'returnzerotracks.fra1.digitaloceanspaces.com') {
        event.respondWith(handleMediaFetch(event.request));
    }
    else if (event.request.method === 'GET' && url.pathname.startsWith('/api/v1')) {
        event.respondWith(handleApiFetch(event.request));
    }
    else {
        event.respondWith(fetch(event.request));
    }
});


function checkCachedResponse(response, expiry) {
    const headers = new Headers(response.headers);
    const cachedDate = new Date(headers.get(workerHeader));
    const ageInSeconds = (new Date().getTime() - cachedDate.getTime()) / 1000;
    return ageInSeconds < expiry;
}


function cloneResponse(response) {
    const responseToCache = response.clone();

    const headers = new Headers(responseToCache.headers);
    headers.set(workerHeader, new Date().toISOString());
    const responseWithDate = new Response(
        responseToCache.body,
        {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
        }
    );
    return responseWithDate;
}


async function handleRequestFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(staticCache);
            await cache.put(request, cloneResponse(networkResponse));
            console.log('Updated cache after successful network request:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Network request failed, falling back to cache:', request.url);
        
        const cache = await caches.open(staticCache);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}


async function handleStaticFetch(request) {
    try {
        const cache = await caches.open(staticCache);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && checkCachedResponse(cachedResponse, staticCacheExpiry)) {
            console.log('Serving static content from cache:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await cache.put(request, cloneResponse(networkResponse));
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Failed to handle static fetch:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

async function handleMediaFetch(request) {
    try {
        const cache = await caches.open(mediaCache);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && checkCachedResponse(cachedResponse, mediaCacheExpiry)) {
            console.log('Serving media content from cache:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await cache.put(request, cloneResponse(networkResponse));
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Failed to handle media fetch:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

async function handleApiFetch(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(apiCache);
            await cache.put(request, cloneResponse(networkResponse));
            console.log('Cached API response for offline use:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('API network request failed, trying cache:', request.url);
        
        const cache = await caches.open(apiCache);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}
