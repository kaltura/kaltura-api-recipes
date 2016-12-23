<% if (typeof showSetup !== undefined && showSetup) { -%>
require 'kaltura'
include Kaltura

config = KalturaConfiguration.new()
config.service_url = 'https://www.kaltura.com'
client = KalturaClient.new(config);
client.ks = client.session_service.start(
    <%- codegen.getValueAsConstant(answers.secret) %>,
    <%- codegen.getValueAsConstant(answers.userId) %>,
    <%- answers.sessionType === 0 ? 'Kaltura::KalturaSessionType::USER' : 'Kaltura::KalturaSessionType::ADMIN' %>,
    <%- answers.partnerId %>)

<% } -%>
<%  parameters.forEach(function(param) { -%>
<%  var setter = codegen.getFieldSetter(param, [], answers); -%>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>

<%  }) -%>
results = client.<%- codegen.rewriteService(service) %>.<%- codegen.rewriteAction(action) %>(<%- -%>
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

