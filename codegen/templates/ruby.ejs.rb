<% if (typeof showSetup !== undefined && showSetup) { -%>
require 'kaltura'
include Kaltura

config = KalturaConfiguration.new()
config.service_url = 'https://www.kaltura.com'
client = KalturaClient.new(config);
client.ks = client.session_service.start(
    <%- codegen.constant(answers.secret) %>,
    <%- codegen.constant(answers.userId) %>,
    <%- answers.sessionType === 0 ? 'Kaltura::KalturaSessionType::USER' : 'Kaltura::KalturaSessionType::ADMIN' %>,
    <%- answers.partnerId || 'YOUR_PARTNER_ID' %>)

<% } -%>
<%  parameters.forEach(function(param) { -%>
<%  var setter = codegen.assignment(param, [], answers); -%>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>

<%  }) -%>
results = client.<%- service %>.<%- action %>(<%- -%>
<% if (parameters.length === 0) { -%>
<%- ')' %>
<% } else if (parameters.length === 1) { -%>
<%- codegen.rewriteVariable(parameters[0].name) + ')' %>
<% } else { -%>

<% parameters.forEach(function(param, index) { -%>
    <%- codegen.rewriteVariable(param.name) %><%- index < parameters.length - 1 ? ',' : ')' %>
<% }); -%>
<% } -%>
puts results.inspect

