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

app.post('/addMetadataProfile', function(req, res) {
  metadataProfile = new Kaltura.objects.KalturaMetadataProfile();
  metadataProfile.metadataObjectType = Kaltura.enums.KalturaMetadataObjectType.ENTRY;
  metadataProfile.name = "foo";
  metadataProfile.systemName = "bar";

  var xsdData = "<xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <xsd:element name=\"metadata\">\n    <xsd:complexType>\n      <xsd:sequence>\n        <xsd:element id=\"md_5F84A7E4-5509-993D-CE9C-3B60C0713775\" name=\"Somefield\" minOccurs=\"0\" maxOccurs=\"1\" type=\"textType\">\n          <xsd:annotation>\n            <xsd:documentation></xsd:documentation>\n            <xsd:appinfo>\n              <label>somefield</label>\n              <key>somefield</key>\n              <searchable>true</searchable>\n              <timeControl>false</timeControl>\n              <description></description>\n            </xsd:appinfo>\n          </xsd:annotation>\n        </xsd:element>\n      </xsd:sequence>\n    </xsd:complexType>\n  </xsd:element>\n  <xsd:complexType name=\"textType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"dateType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:long\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:complexType name=\"objectType\">\n    <xsd:simpleContent>\n      <xsd:extension base=\"xsd:string\"/>\n    </xsd:simpleContent>\n  </xsd:complexType>\n  <xsd:simpleType name=\"listType\">\n    <xsd:restriction base=\"xsd:string\"/>\n  </xsd:simpleType>\n</xsd:schema>";
  var viewsData = null;

  client.metadataProfile.add(function(results) {
    if (results && results.code && results.message) {
      console.log('Kaltura Error', results);
      res.send(results.message);
    } else {
      res.render('metadataProfileShow', {request: req.body, result: results})
    }
  },
  metadataProfile,
  xsdData,
  viewsData);
});

app.listen(process.env.PORT || 3333);
