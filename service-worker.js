self.addEventListener('install', async event => {
    console.log('install event')
});

self.addEventListener('fetch', event => {
    const req = event.request;

    if (/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

var cache_name = 'ceferin-cache';
var cached_urls = [
    'offline.html',
    'fourohfour.html',
    'account.html',
    'altontowers.html',
    'bet365.html',
    'booking-altonTowers.html',
    'booking-manchesterAirport.html',
    'booking-northStaffsHotel.html',
    'bookings.html',
    'emmabridgewater.html',
    'freeportTalke.html',
    'index.html',
    'intupotteries.html',
    'search.html',
    'trenthamEstate.html',
    'style.css'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        cache.open(cache_name)
            .then(function (cache) {
                return cache.addAll(cached_urls);
            })
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}