var express = require('express');
var bodyParser = require('body-parser');
var busboy = require('busboy');
var request = require('request');
var Kaltura = require('./../../lib/KalturaClient.js');
var config = new Kaltura.KalturaConfiguration(1760921);
config.serviceUrl = "https://www.kaltura.com/";
var client = new Kaltura.KalturaClient(config);
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', success, ks);
  } else {
    client.setKs(ks);
  }
}, "8d6cb692ab0f41bfa6bde373204c4b40",
"lucybot@example.com",
Kaltura.enums.KalturaSessionType.ADMIN,
1760921)

var app = express();
app.use('/', express.static(__dirname + '/www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
})

app.post('/CreateMediaEntry', function(req, res) {
  var entry = new Kaltura.objects.KalturaMediaEntry();
  entry.name = req.body.name;
  entry.mediaType = 1;
  client.media.add(function(entry) {
    var mediaResource = new Kaltura.objects.KalturaUploadedFileTokenResource();
    mediaResource.token = req.body.uploadTokenId;
    var checkStatus = function(entry) {
      if (entry.status === 2) {
        res.render('CreatedEntry', {request: req.body, result: entry})
      } else {
        setTimeout(function() {
          client.media.get(checkStatus, entry.id);
        }, 100);
      }
    }
    client.media.addContent(checkStatus, entry.id, mediaResource);
  }, entry);
});

app.post('/UploadFile', function(req, res) {
  req.body = req.body || {};
  var bus = new busboy({headers: req.headers});
  var dest = null;
  bus.on('file', function(field, file, filename) {
    dest = __dirname + '/' + filename;
    file.pipe(require('fs').createWriteStream(dest));
  });
  bus.on('field', function(field, value) {
    req.body[field] = value;
  });
  bus.on('finish', function() {
    var uploadToken = new Kaltura.objects.KalturaUploadToken();
    client.uploadToken.add(function(result) {
      var tokenId = result.id;
      client.uploadToken.upload(function(result) {
        res.render('UploadDone', {request: req.body, result: result})
      }, tokenId, dest);
    }, uploadToken)
  });
  req.pipe(bus);
});

app.listen(process.env.PORT || 3333);
