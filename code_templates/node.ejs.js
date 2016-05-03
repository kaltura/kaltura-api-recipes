<% if (showSetup) { -%>
var Kaltura = require('kaltura');
var config = new Kaltura.KalturaConfiguration(<%- answers.partnerId %>);
var client = new Kaltura.KalturaClient(config);
var sessionID = null;
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', success, ks);
  } else {
    sessionID = ks;
    client.setKs(ks);
  }
}, <%- helper.getValue(answers.secret) %>,
<%- helper.getValue(answers.userId) %>,
<%- answers.sessionType === 0 ? 'Kaltura.enums.KalturaSessionType.USER' : 'Kaltura.enums.KalturaSessionType.ADMIN' %>,
<%- helper.getValue(answers.partnerId) %>)
<% } -%>

<%  parameters.forEach(function(param) { -%>
<%  var setter = helper.getFieldSetter(param, [], answers); %>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>
<%  }) -%>

client.<%- service %>.<%- action %>(function(results) {
  if (results && results.code && results.message) {
    console.log('Kaltura Error', success, results);
  } else {
    console.log('Kaltura Result', results);
  }
}<%- parameters.length === 0 ? ');' : ',' %>
<% parameters.forEach(function(param, index) { -%>
<%- param.name %><%- index < parameters.length - 1 ? ',' : ');' %>
<% }); -%>
