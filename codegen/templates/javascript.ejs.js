<%  parameters.forEach(function(param) { -%>
<%  var setter = helper.getFieldSetter(param, [], answers); -%>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>

<%  }) -%>
client.<%- service %>.<%- action %>(function(success, results) {
  if (!success || (results && results.code && results.message)) {
    console.log('Kaltura Error', success, results);
  } else {
    console.log('Kaltura Result', results);
  }
}<%- parameters.length === 0 ? ');' : ',' %>
<% parameters.forEach(function(param, index) { -%>
<%- param.name %><%- index < parameters.length - 1 ? ',' : ');' %>
<% }); -%>
