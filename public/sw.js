/* GRC service worker — app-shell + offline ride packs */
const CACHE = 'grc-shell-v5'
const PRECACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/discover',
  '/club',
  '/club/members',
  '/passport',
  '/passport/garage',
  '/ride/live',
  '/ride/summary',
  '/captain',
  '/wrench',
  '/feed',
  '/rides/ngong-magadi',
  '/brand/hero-adventure.jpg',
  '/brand/adventure-wide.jpg',
  '/brand/clubhouse.jpg',
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

  // Network-first for navigations; cache fallback offline
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

  // Cache-first for brand, icons, and route pack assets
  if (
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/icons/') ||
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
