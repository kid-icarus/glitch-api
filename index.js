var express = require('express')
var fs = require('fs')
var gm = require('gm')
var app = express()
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var concat = require('concat-stream')
var height, width

var noises = [
  'uniform',
  'gaussian',
  'multiplicative',
  'impulse',
  'laplacian',
  'poisson',
]

// lol this is so stupid.
Array.prototype.random = function() {
  return this[rng(0, this.length - 1)]
}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.use(bodyParser.json({limit: '1mb'}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html')
})


app.post('/service', function(req, res) {
  var imgBuff = dataUriToBuffer(req.body.content)
  gm(imgBuff).noise(noises.random())
    .contrast(-6)
    .colorize(rng(0,256), rng(0,256), rng(0,256))
    .stream()
    .pipe(concat(function(goob){
      res.json({content: 'data:' + imgBuff.type + ';base64,' + goob.toString('base64')})
    }))
})

app.listen(8000)
