//var cached_urls = [
//    'offline.html',
//    'index.html'
    
//];
//var cache_name = 'ceferin_v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('ceferin_v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
            ]);
        })
            //.then(function (cache) {
            //    return cache.addAll(cached_urls);
            //})
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

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => {
            return resp || fetch(event.request).then((response) => {
                return caches.open('ceferin_v1').then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

//self.addEventListener('fetch', function (event) {
//    console.log('Fetch event for ', event.request.url);
//    event.respondWith(
//        caches.match(event.request).then(function (response) {
//            if (response) {
//                console.log('Found ', event.request.url, ' in cache');
//                return response;
//            }
//            console.log('Network request for ', event.request.url);
//            return fetch(event.request).then(function (response) {
//                if (response.status === 404) {
//                    return caches.match('offline.html');
//                }
//                return caches.open(cached_urls).then(function (cache) {
//                    cache.put(event.request.url, response.clone());
//                    return response;
//                });
//            });
//        }).catch(function (error) {
//            console.log('Error, ', error);
//            return caches.match('offline.html');
//        })
//    );
//});