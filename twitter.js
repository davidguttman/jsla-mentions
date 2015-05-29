var _ = require('lodash')
var through2 = require('through2')
var Twit = require('twit')

var creds = require('./config.json')
var T = new Twit(creds)

module.exports = function(sinceId, cb) {
  getMentions(sinceId, function(err, data) {
    if (err) return cb(err)

    var users = {}

    data.statuses.forEach(function(tweet) {
      var item = {
        id: tweet.id_str,
        createdAt: tweet.created_at,
        from: tweet.user.screen_name,
        text: tweet.text,
        fromFollowers: tweet.user.followers_count
      }

      users[item.from] = users[item.from] || {}
      users[item.from][item.id] = item
    })

    var winners = _.sample(Object.keys(users), 10)

    var winnerData = winners.map(function(name) {
      return [name, _.values(users[name])]
    })

    var output = {
      winners: winnerData,
      meta: data.search_metadata
    }

    cb(null, output)
  })
}

function getMentions (since_id, cb) {
  var opts = {
    q: '@jsdotla',
    count: 100,
    since_id: since_id,
    // since_id: '603721648034971648',
    // since_id: '604059628964593664',
    include_entities: true
  }

  T.get('search/tweets', opts, cb)
}
