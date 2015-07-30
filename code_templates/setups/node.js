var Kaltura = require('./<%- Lucy.answer("libraryDirectory") || "lib/" %>KalturaClient.js');
var config = new Kaltura.KalturaConfiguration(<%- Lucy.answer('partnerId') %>);
config.serviceUrl = <%- Lucy.code.variable('answers.serviceURL') %>;
var client = new Kaltura.KalturaClient(config);
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', success, ks);
  } else {
    client.setKs(ks);
  }
}, <%- Lucy.variable("answers.secret") %>,
<%- Lucy.variable("answers.userId") %>,
<%- Lucy.answer('sessionType') === 0 ? 'Kaltura.enums.KalturaSessionType.USER' : 'Kaltura.enums.KalturaSessionType.ADMIN' %>,
<%- Lucy.variable('answers.partnerId') %>)

