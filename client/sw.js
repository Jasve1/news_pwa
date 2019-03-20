const cache_name = 'news_app_v1';
const cache_assets = [
    './index.html',
    './style.css',
    './app.js'
]

self.addEventListener('install', async e => {
    const cache = await caches.open(cache_name);
    cache.addAll(cache_assets);
});

self.addEventListener('fetch', e => {
    const req = e.request;
    e.respondWith(cacheFirst(req));
});

async function cacheFirst(req){
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}