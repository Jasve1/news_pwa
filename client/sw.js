const cache_name = 'news_app_v2';
const cache_assets = [
    './index.html',
    './style.css',
    './app.js',
    './fallback.json',
    './images/fallbackImg.jpg'
]

self.addEventListener('install', async e => {
    const cache = await caches.open(cache_name);
    cache.addAll(cache_assets);
});

self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);

    if(url.origin === location.origin){
        e.respondWith(cacheFirst(req));
    }else{
        e.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req){
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req){
    const cache = await caches.open('news-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(function(cacheName){
            if(cache_name !== cacheName && cacheName.startsWith('news_app')){
                return caches.delete(cacheName);
            }
        })
    );
});

//Listens to push event then shows notification
self.addEventListener('push', e => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: 'Notified by News',
        icon: './images/icons/icon-72x72.png'
    })
})