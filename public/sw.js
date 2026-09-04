/* GRC service worker — app-shell + offline ride packs */
const CACHE = 'grc-shell-v9'
const PRECACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png?v=4',
  '/icons/icon-512.png?v=4',
  '/icons/icon-maskable-512.png?v=4',
  '/brand/grc-hex.png?v=4',
  '/discover',
  '/club',
  '/club/members',
  '/passport',
  '/passport/garage',
  '/search',
  '/settings',
  '/club/leaderboard',
  '/ride/live',
  '/ride/summary',
  '/captain',
  '/wrench',
  '/feed',
  '/rides/ngong-magadi',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(url).catch(() => undefined)
        )
      )
    ).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // Always network-first for logos / icons so brand updates aren't stuck
  if (
    url.pathname.startsWith('/brand/grc-') ||
    url.pathname.startsWith('/brand/logo') ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
          return res
        })
        .catch(() => caches.match(req))
    )
    return
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
          return res
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/')))
    )
    return
  }

  // Cache-first for heavy brand photos + route packs
  if (
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/gpx/') ||
    url.pathname.startsWith('/routes/')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req).then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
          return res
        })
      })
    )
  }
})
