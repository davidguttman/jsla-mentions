var http = require('http')
var twitter = require('./twitter')

var server = http.createServer(function(req, res) {
  console.log('req.url', req.url)
  var startId = req.url.replace('/', '')

  twitter(startId, function(err, data) {
    if (err) return res.end(500)

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(data, null, 2))
  })
})

var PORT = process.env.PORT || 3044

server.listen(PORT)
console.log('Twitter JS.LA Mentions listening on', PORT)
