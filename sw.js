self.addEventListener('install', function (event) {
  console.log('install')
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.indexOf('googleusercontent') > -1) {
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
              return fetch(newRequest)
                .then(function (response) {
                  cache.put(event.request, response.clone())
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
