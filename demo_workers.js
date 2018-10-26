const newRequest = new Request("https://lh3.googleusercontent.com/d/1kF-84rtQi6BCQYKbxMN6VYJ7Zg3VhsZb=s0")
let time1,time2,time0
time0 = new Date().getTime()
fetch(newRequest)
  .then(function (response) {
    time1 = new Date().getTime()
    return response.arrayBuffer()
  })
  .then(function (buffer) {
    time2 = new Date().getTime()
    console.log(time1 - time0, time2 - time1)
  })
