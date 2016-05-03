<% if (typeof showSetup !== undefined && showSetup) { -%>
require 'kaltura'
include Kaltura

config = KalturaConfiguration.new()
client = KalturaClient.new(config);
client.ks = client.session_service.start(
    <%- helper.getValue(answers.secret) %>,
    <%- helper.getValue(answers.userId) %>,
    <%- answers.sessionType === 0 ? 'KalturaSessionType::USER' : 'KalturaSessionType::ADMIN' %>,
    <%- answers.partnerId %>)

<% } -%>
<%  parameters.forEach(function(param) { -%>
<%  var setter = helper.getFieldSetter(param, [], answers); -%>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>

<%  }) -%>
results = client.<%- helper.rewriteService(service) %>.<%- helper.rewriteAction(action) %>(<%- -%>
<% if (parameters.length === 0) { -%>
<%- ')' %>
<% } else if (parameters.length === 1) { -%>
<%- parameters[0].name + ')' %>
<% } else { -%>

<% parameters.forEach(function(param, index) { -%>
    <%- param.name %><%- index < parameters.length - 1 ? ',' : ')' %>
<% }); -%>
<% } -%>
puts results.inspect

