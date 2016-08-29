var Kaltura = require('kaltura');
var config = new Kaltura.kc.KalturaConfiguration(<%- answers.partnerId %>);
var client = new Kaltura.kc.KalturaClient(config);
var sessionID = null;
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', ks);
  } else {
    client.setKs(ks);
<%- helper.indent(code, 4) %>
  }
}, <%- helper.getValue(answers.secret) %>,
<%- helper.getValue(answers.userId) %>,
<%- answers.sessionType === 0 ? 'Kaltura.enums.KalturaSessionType.USER' : 'Kaltura.enums.KalturaSessionType.ADMIN' %>,
<%- answers.partnerId %>)
