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

app.post('/HandleHTTPNotifications', function(req, res) {
  app.post('*', function(req, res) {
    console.log('Kaltura Notification', req.body);
  });
});

app.post('/listTemplatesEventNotificationTemplate', function(req, res) {
  filter = new Kaltura.objects.KalturaEventNotificationTemplateFilter();

  pager = new Kaltura.objects.KalturaFilterPager();


  client.eventNotificationTemplate.listTemplates(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaEventNotificationTemplateListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});

app.post('/cloneEventNotificationTemplate', function(req, res) {
  var template = null;
  if (req.body.email) {
    template = new Kaltura.objects.KalturaEmailNotificationTemplate();
    var recipient = new KalturaEmailNotificationRecipient();
    recipient.email = req.body.email;
    template.to = new KalturaEmailNotificationStaticRecipientProvider();
    template.to.emailRecipients = [recipient];
  } else {
    template = new KalturaHttpNotificationTemplate();
    template.url = req.body.url;
  }
  template.name = req.body.name;
  template = client.eventNotificationTemplate.cloneAction(function(template) {
    client.eventNotificationTemplate.updateStatus(function(template) {
      res.render('KalturaEventNotificationTemplate', {request: req.body, result: template}) 
    },
    template.id,
    Kaltura.enums.KalturaEventNotificationTemplateStatus.ACTIVE);
  }, null, template);
});

app.post('/listEventNotificationTemplate', function(req, res) {
  filter = new Kaltura.objects.KalturaEventNotificationTemplateFilter();

  pager = new Kaltura.objects.KalturaFilterPager();


  client.eventNotificationTemplate.listAction(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaEventNotificationTemplateListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});

app.post('/listPermission', function(req, res) {
  filter = new Kaltura.objects.KalturaPermissionFilter();
  filter.nameEqual = "EVENTNOTIFICATION_PLUGIN_PERMISSION";

  pager = new Kaltura.objects.KalturaFilterPager();


  client.permission.listAction(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('KalturaPermissionListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});

app.listen(process.env.PORT || 3333);
