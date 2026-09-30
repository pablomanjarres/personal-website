const CACHE = 'cortex-demo-brand-v3'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && (k.startsWith('cortex-demo-') || k === 'cortex-v1' || k === 'cortex-api-v1')).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // The sample app has no backend. Never forward API requests.
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(new Response('null', { headers: { 'Content-Type': 'application/json' } }))
    return
  }

  if (url.origin !== self.location.origin || !url.pathname.startsWith('/demos/cortex/')) return

  // Static assets: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request).then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()))
        return res
      })
      return cached || fetchPromise
    })
  )
})
