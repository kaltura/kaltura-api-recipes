var Kaltura = require('kaltura');
var config = new Kaltura.KalturaConfiguration(<%- answers.partnerId %>);
var client = new Kaltura.KalturaClient(config);
var sessionID = null;
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', ks);
  } else {
    sessionID = ks;
    client.setKs(ks);
  }
<% } -%>
<%- helper.indent(code, 2) %>
}, <%- helper.getValue(answers.secret) %>,
<%- helper.getValue(answers.userId) %>,
<%- answers.sessionType === 0 ? 'Kaltura.enums.KalturaSessionType.USER' : 'Kaltura.enums.KalturaSessionType.ADMIN' %>,
<%- helper.getValue(answers.partnerId) %>)
<% } -%>
