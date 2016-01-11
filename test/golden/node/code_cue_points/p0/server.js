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

app.post('/listCuePoint', function(req, res) {
  filter = new Kaltura.objects.KalturaCuePointFilter();
  filter.cuePointTypeEqual = Kaltura.enums.KalturaCuePointType.CODE;
  filter.entryIdEqual = "1_318vzqcr";

  pager = new Kaltura.objects.KalturaFilterPager();


  client.cuePoint.listAction(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('CodeCuePointListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});

app.post('/addCodeCuePoint', function(req, res) {
  var cuePoint = new Kaltura.objects.KalturaCodeCuePoint();
  cuePoint.code = req.body.code;
  cuePoint.description = req.body.description;
  cuePoint.startTime = req.body.startTime;
  cuePoint.entryId = "1_318vzqcr";
  client.cuePoint.add(function(result) {
    res.render('CodeCuePointAdded', {request: req.body, result: result})
  }, cuePoint);
});

app.post('/getMedia', function(req, res) {
  var entryId = req.body.entryId;
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

app.listen(process.env.PORT || 3333);
