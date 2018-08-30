var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var Twit = require('twit');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 52000});


/*****
Setup Express
*****/
app.set('views', './views');
app.set('view engine', 'pug');

app.use(function(req, res, next) {
  console.log('%s request to %s from %s', req.method, req.path, req.ip);
  next();
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);
console.log('Server started on ' + port);


/*****
Setup Twitter
*****/
var T = new Twit({
  consumer_key:         'ZkLcueXW0pfH75Tf2chbS3Qpn',
  consumer_secret:      'GjXJyjKsSKmMcSjgUe8mPxrcwl7moebynBLFpfuLcyT2MRhYmU',
  access_token:         '1116383256-Iz2WKF8BxKeFJKCCIbx75Z6HLvYlZIlAJV552Yu',
  access_token_secret:  '0RyLGBI2cj4TpV4ei0Tl6RiC6xfCYf7LC3BM4byDWY8hL',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});


/*****
Setup websocket server
*****/
wss.on('connection', function (ws) {
    
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function (message) {
        console.log('received: %s', message)
    });



    var stream = T.stream('statuses/filter', { track: '#fakenews', language: 'en' })

    stream.on('tweet', function (res) {
        
        var payload = {
            user: res.user.screen_name,
            tweet: res.text,
            tag: '#fakenews'
        }

        if (ws.readyState === 1) {
          ws.send(JSON.stringify(payload), function(error) {
            if (error !== undefined) console.log(error);
          });
        }
    });

});

wss.on('close', function() {
  console.log('disconnected');
});

wss.on('error', function() {
  console.log('error');
});

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 500);
