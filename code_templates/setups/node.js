var Kaltura = require('./<%- Lucy.answer("libraryDirectory") %>KalturaClient.js');
var config = new Kaltura.KalturaConfiguration(<%- Lucy.answer('partnerId') %>);
config.serviceUrl = "https://www.kaltura.com/";
var client = new Kaltura.KalturaClient(config);
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', success, ks);
  } else {
    client.setKs(ks);
  }
}, <%- Lucy.variable("answers.adminSecret") %>,
<%- Lucy.variable("answers.userId") %>,
<%- Lucy.answer('sessionType') === 0 ? 'Kaltura.enums.KalturaSessionType.USER' : 'Kaltura.enums.KalturaSessionType.ADMIN' %>,
<%- Lucy.variable('answers.partnerId') %>)

