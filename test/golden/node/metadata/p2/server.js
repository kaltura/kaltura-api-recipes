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

app.post('/addMetadataProfile', function(req, res) {
  metadataProfile = new Kaltura.objects.KalturaMetadataProfile();
  metadataProfile.metadataObjectType = Kaltura.enums.KalturaMetadataObjectType.ENTRY;
  metadataProfile.name = "foo";
  metadataProfile.systemName = "bar";

  var xsdData = "<xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <xsd:element name=\"metadata\">\n    <xsd:complexType>\n      <xsd:sequence>\n        <xsd:element id=\"md_5F84A7E4-5509-993D-CE9C-3B60C0713775\" name=\"Somefield\" minOccurs=\"0\" maxOccurs=\"1\" type=\"textType\">\n          <xsd:annotation>\n            <xsd:documentation></xsd:documentation>\n            <xsd:appinfo>\n              <label>somefield</label>\n              <key>somefield</key>\n              <searchable>true</searchable>\n              <timeControl>false</timeControl>\n              <description></description>\n            </xsd:appinfo>\n          </xsd:annotation>\n        </xsd:element>\n      </xsd:sequence>\n    </xsd:complexType>\n  </xsd:element>\n  <xsd:complexType name=\"textType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"dateType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:long\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"objectType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:simpleType name=\"listType\">\n    <xsd:restriction base=\"xsd:string\"/>\n  </xsd:simpleType>\n</xsd:schema>";
  var viewsData = null;

  client.metadataProfile.add(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', results);
      res.render('metadataProfileShow', {request: req.body, result: results})
    } else {
      res.render('metadataProfileShow', {request: req.body, result: results})
    }
  },
  metadataProfile,
  xsdData,
  viewsData);
});

app.post('/addMetadata', function(req, res) {
  var metadataProfileId = null;
  var objectType = Kaltura.enums.KalturaMetadataObjectType.ENTRY;
  var objectId = null;
  var xmlData = "<metadata><Somefield>LINUX RULES</Somefield></metadata>";

  client.metadata.add(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', results);
      res.render('metadataShow', {request: req.body, result: results})
    } else {
      res.render('metadataShow', {request: req.body, result: results})
    }
  },
  metadataProfileId,
  objectType,
  objectId,
  xmlData);
});

app.post('/deleteMetadataProfile', function(req, res) {
  var id = req.body.id;

  client.metadataProfile.deleteAction(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', results);
      res.render('metadataProfileDeleted', {request: req.body, result: results})
    } else {
      res.render('metadataProfileDeleted', {request: req.body, result: results})
    }
  },
  id);
});

app.post('/listMetadataProfile', function(req, res) {
  filter = new Kaltura.objects.KalturaMetadataProfileFilter();

  pager = new Kaltura.objects.KalturaFilterPager();


  client.metadataProfile.listAction(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', results);
      res.render('KalturaMetadataProfileListResponse', {request: req.body, result: results})
    } else {
      res.render('KalturaMetadataProfileListResponse', {request: req.body, result: results.objects})
    }
  },
  filter,
  pager);
});

app.listen(process.env.PORT || 3333);
