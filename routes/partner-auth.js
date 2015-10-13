var Router = module.exports = require('express').Router();

var kc = require('../lib/KalturaClient');
var ktypes = require('../lib/KalturaTypes');
var vo = require ('../lib/KalturaVO.js');
var config = {
  partner_id: 102,
  admin_secret: '92ed864443d6cfadee508167016ea309',
  user_id: null,
}

Router.use(require('body-parser').json());

var COPY_FIELDS = [
  'firstName', 'lastName', 'country', 'state',
];
var MAP_FIELDS = [
  {from: 'company', to: 'description'},
  {from: 'email', to: 'adminEmail'},
]
Router.post('/signup', function(req, res) {
  var kaltura_conf = new kc.KalturaConfiguration(config.partner_id);
  var client = new kc.KalturaClient(kaltura_conf);
  var type = ktypes.KalturaSessionType.ADMIN;

  var expiry = null;
  var privileges = null;
  client.session.start(function(ks) {
    var partner = new vo.KalturaPartner();
    COPY_FIELDS.forEach(function(f) {
      if (req.body[f]) partner[f] = req.body[f];
    });
    MAP_FIELDS.forEach(function(f) {
      if (req.body[f.from]) partner[f.to] = req.body[f.from];
    })
    partner.name = req.body.firstName + ' ' + req.body.lastName;
    partner.appearInSearch = null;
    partner.partnerPackage = 100;
    var cms_password = 'testit';
    var template_partner_id = null;
    var silent = null;
    client.partner.register(function(results) {
      if (!results) return res.status(500).end();
      if (results.code && results.message) return res.status(500).send(results.message);
      res.json(results);
    }, partner, cms_password, template_partner_id, silent);
  }, config.admin_secret, config.user_id, type, config.partner_id, expiry, privileges);
});

Router.post('/login', function(req, res) {
  res.send('not impl');
})
