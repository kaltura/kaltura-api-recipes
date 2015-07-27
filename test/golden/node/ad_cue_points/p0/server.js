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

app.post('/listCuePoint', function(req, res) {
  filter = new Kaltura.objects.KalturaCuePointFilter();
  filter.entryIdEqual = "1_318vzqcr";

  pager = new Kaltura.objects.KalturaFilterPager();


  client.cuePoint.listAction(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', success, results);
    } else {
      console.log('Kaltura Result', results);
  res.render('KalturaCuePointListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});
app.post('/addCuePoint', function(req, res) {
  var cuePoint = new Kaltura.objects.KalturaAdCuePoint();
  cuePoint.sourceUrl = req.body.sourceUrl;
  cuePoint.startTime = req.body.startTime;
  cuePoint.entryId = "1_318vzqcr";
  client.cuePoint.add(function(result) {
    res.json(result);
  }, cuePoint);
});
app.post('/getMedia', function(req, res) {
  var entryId = req.body.entryId;
  var version = null;

  client.media.get(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', success, results);
    } else {
      console.log('Kaltura Result', results);
  res.render('KalturaMediaEntry', {request: req.body, result: results})
    }
  },
  entryId,
  version);
});

app.listen(process.env.PORT || 3333);