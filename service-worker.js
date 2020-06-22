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

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName.startsWith('pages-cache-') && staticCacheName !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request).then(function (response) {
                if (response.status === 404) {
                    return caches.match('fourohfour.html');
                }
                return caches.open(cached_urls).then(function (cache) {
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            });
        }).catch(function (error) {
            console.log('Error, ', error);
            return caches.match('offline.html');
        })
    );
});