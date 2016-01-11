var express = require('express');
var bodyParser = require('body-parser');
var busboy = require('busboy');
var request = require('request');
var Kaltura = require('./../../lib/KalturaClient.js');
var config = new Kaltura.KalturaConfiguration(102);
config.serviceUrl = "http://jessex";
var client = new Kaltura.KalturaClient(config);
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', success, ks);
  } else {
    client.setKs(ks);
  }
}, "e472b44321fe63f669d825479b21cdb2",
"lucybot@example.com",
Kaltura.enums.KalturaSessionType.USER,
102)

var app = express();
app.use('/', express.static(__dirname + '/www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
})

app.post('/getMedia', function(req, res) {
  var entryId = "1_9kdmnhuv";
  var version = null;

  client.media.get(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaMediaEntry', {request: req.body, result: results})
    }
  },
  entryId,
  version);
});

app.post('/searchCaptionAssetItem', function(req, res) {
  entryFilter = new Kaltura.objects.KalturaBaseEntryFilter();

  captionAssetItemFilter = new Kaltura.objects.KalturaCaptionAssetItemFilter();
  captionAssetItemFilter.contentLike = "support";

  captionAssetItemPager = new Kaltura.objects.KalturaFilterPager();


  client.captionAssetItem.search(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('CaptionSearch', {request: req.body, result: results.objects})
    }
  },
  entryFilter,
  captionAssetItemFilter,
  captionAssetItemPager);
});

app.post('/attachCaptions', function(req, res) {
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
        var captionResource = new Kaltura.objects.KalturaUploadedFileTokenResource();
        captionResource.token = result.id;
        captionAsset = new Kaltura.objects.KalturaCaptionAsset();
        captionAsset.format = Kaltura.enums.KalturaCaptionType.SRT;
        captionAsset.isDefault = true;
        captionAsset.language = Kaltura.enums.KalturaLanguage.EN;
        captionAsset.label = 'English';
        client.captionAsset.add(function(newAsset) {
          client.captionAsset.setContent(function(result) {
            res.render('CaptionsAttached', {request: req.body, result: result})
          }, newAsset.id, captionResource);
        }, "1_9kdmnhuv", captionAsset)
      }, tokenId, dest);
    }, uploadToken)
  })
  req.pipe(bus);
});

app.listen(process.env.PORT || 3333);
