<% if (showSetup) { -%>
from KalturaClient import *
from KalturaClient.Plugins.Core import *
config = KalturaConfiguration(<%- answers.partnerId %>)
config.serviceUrl = "https://www.kaltura.com/"
client = KalturaClient(config)
ks = client.session.start(
      <%- codegen.constant(answers.secret) %>,
      <%- codegen.constant(answers.userId) %>,
      <%- answers.sessionType === 0 ? 'KalturaSessionType.USER' : 'KalturaSessionType.ADMIN' %>,
      <%- codegen.constant(answers.partnerId) || 'YOUR_PARTNER_ID' %>)
client.setKs(ks)
<% } -%>

<% parameters.forEach(function(param) { -%>
<%- codegen.assignment(param, [], answers) %>
<% }) -%>

<% var parameterNames = parameters.map(function(p) {return  p.name}) -%>
result = client.<%- service %>.<%- action %>(<%- parameterNames.join(', ') %>);
print(result);
