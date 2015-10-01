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

app.post('/getTableReport', function(req, res) {
  reportInputFilter = new Kaltura.objects.KalturaReportInputFilter();
  reportInputFilter.fromDay = "20150615";
  reportInputFilter.toDay = "20150715";

  pager = new Kaltura.objects.KalturaFilterPager();

  var reportType = Kaltura.enums.KalturaReportType.USER_TOP_CONTENT;
  var order = "count_plays";
  var objectIds = null;

  client.report.getTable(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaReportTable', {request: req.body, result: results})
    }
  },
  reportType,
  reportInputFilter,
  pager,
  order,
  objectIds);
});

app.listen(process.env.PORT || 3333);
