self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("song-library-v1").then((cache) => {
      return cache.addAll(["/offline", "/manifest.json"])
    })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response
        }
        if (event.request.mode === "navigate") {
          return caches.match("/offline")
        }
        return new Response("Network error happened", {
          status: 408,
          headers: { "Content-Type": "text/plain" }
        })
      })
    })
  )
})
