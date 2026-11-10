// Abreys Irrigation — keeps the app opening when there's no signal.
// The page is always fetched fresh when online (so updates arrive straight away);
// the saved copy is only used when the network fails. Data never goes through here.
const C = 'irr-shell-v1', SHELL = ['Irrigation.html', 'irrigation.webmanifest', 'irrigation-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !SHELL.some(s => u.pathname.endsWith('/' + s))) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
