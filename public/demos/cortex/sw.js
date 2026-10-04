const CACHE = 'cortex-demo-graphite-teal-v3'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key !== CACHE && key.startsWith('cortex-demo-')).map((key) => caches.delete(key)))
    await self.clients.claim()
    const clients = await self.clients.matchAll({ type: 'window' })
    await Promise.all(clients.filter((client) => {
      const url = new URL(client.url)
      return url.origin === self.location.origin && url.pathname.startsWith('/demos/cortex/')
    }).map((client) => client.navigate(client.url)))
  })())
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // The sample app has no backend. Never forward API requests.
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(new Response('{"ok":false,"error":"This service is unavailable in the browser demo."}', { status: 503, headers: { 'Content-Type': 'application/json' } }))
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
