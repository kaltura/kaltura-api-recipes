<% parameters.filter(function(param) {return param.fields}).forEach(function(param) { -%>
<%- param.name %> = new <%- param.class %>();
<%   param.fields.forEach(function(field) { -%>
<%- param.name %>.<%- field.name %> = <%- field.value %>;
<%   }); -%>
<% }); -%>

var getResults = function() {
  if (!client.ks) return setTimeout(getResults, 100);
  client.<%- service %>.<%- action %>(function(success, results) {
    if (!success || (results.code && results.message)) {
      console.log('Kaltura Error', results);
    } else {
<%- '<\%- Lucy.returnCode("results.objects", 6) %\>' %>
    }
  }<%- parameters.length === 0 ? ');' : ',' %>
<% parameters.forEach(function(param, index) { -%>
  <%- param.name %><%- index < parameters.length - 1 ? ',' : ');' %>
<% }); -%>
}
getResults();
