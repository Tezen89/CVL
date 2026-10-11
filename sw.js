// Service worker : permet l'installation et un fonctionnement de secours hors réseau.
// Stratégie « réseau d'abord » : on sert toujours la dernière version en ligne,
// le cache ne sert que si le réseau est absent (fond de vallée, bois…).
const CACHE = 'pere-quignon-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copie = res.clone(); caches.open(CACHE).then(c => c.put(req, copie)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(m => m || (req.mode === 'navigate' ? caches.match('index.html', {ignoreSearch: true}) : undefined)))
  );
});
