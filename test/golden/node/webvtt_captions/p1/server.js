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

app.post('/listCaptionAsset', function(req, res) {
  filter = new Kaltura.objects.KalturaAssetFilter();

  pager = new Kaltura.objects.KalturaFilterPager();


  client.captionAsset.listAction(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaCaptionAssetListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});

app.post('/getCaptionAsset', function(req, res) {
  var captionAssetId = null;

  client.captionAsset.get(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaCaptionAsset', {request: req.body, result: results})
    }
  },
  captionAssetId);
});

app.listen(process.env.PORT || 3333);
