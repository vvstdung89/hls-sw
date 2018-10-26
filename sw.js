self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event)
})

//https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#clientsclaim
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ...', event)
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.indexOf('goosgleusercontent') > -1) {
    console.log('onfetch', event)
    const newRequest = new Request(event.request.url)

    var from, to
    for (const [header, value] of event.request.headers) {
      if (header == 'range') {
        let newValue = value.replace('bytes=', '')
        from = newValue.split('-')[0].trim()
        to = newValue.split('-')[1].trim()
      }
    }

    if (caches) {
      event.respondWith(
        caches.open('mysite-dynamic').then(function (cache) {
          return cache.match(event.request).then(function (response) {
            if (response) {
              return response.arrayBuffer().then(function (buffer) {
                let newBuffer = to ? buffer.slice(from, to) : buffer
                var myResponse = new Response(newBuffer, {
                  status: 200,
                  statusText: ''
                })
                return myResponse
              })
            } else {
              var time1,time2,time0
              time0 =new Date().getTime()
              return fetch(newRequest)
                .then(function (response) {
                  time1 =new Date().getTime()
                  cache.put(event.request, response.clone())
                  return response.arrayBuffer()
                })
                .then(function (buffer) {
                  time2 =new Date().getTime()
                  console.log(time1-time0, time2-time1)
                  let newBuffer = to ? buffer.slice(from, to) : buffer
                  var myResponse = new Response(newBuffer, {
                    status: 200,
                    statusText: ''
                  })
                  return myResponse
                })
            }
          })
        })
      )
    } else {
      event.respondWith(
        fetch(newRequest)
          .then(function (response) {
            return response.arrayBuffer()
          })
          .then(function (buffer) {
            let newBuffer = to ? buffer.slice(from, to) : buffer
            var myResponse = new Response(newBuffer, {
              status: 200,
              statusText: ''
            })
            return myResponse
          })
      )
    }
  }
})
