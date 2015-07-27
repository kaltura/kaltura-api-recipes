<% parameters.filter(function(param) {return param.fields}).forEach(function(param) { -%>
<%- param.name %> = new Kaltura.objects.<%- param.class %>();
<%   param.fields.forEach(function(field) { -%>
<%- '<\% if (Lucy.answer("' + field.name + '") !== null) { -%\>' %>
<%- param.name %>.<%- field.name %> = <%- '<\%- Lucy.code.variable("answers.' + field.name + '") %\>' %>;
<%- '<\% } -%\>' %>
<%   }); -%>

<% }); -%>
<% parameters.filter(function(param) {return !param.fields}).forEach(function(param) { -%>
var <%- param.name %> = <%- '<\%- Lucy.code.variable("answers.' + param.name + '") %\>' %>;
<% }); -%>

client.<%- service %>.<%- action %>(function(results) {
  if (results.code && results.message) {
    console.log('Kaltura Error', success, results);
  } else {
    console.log('Kaltura Result', results);
<% if (returns === 'list') { -%>
<%- '<\%- Lucy.returnCode("results.objects", 4) %\>' %>
<% } else { -%>
<%- '<\%- Lucy.returnCode("results", 4) %\>' %>
<% } -%>
  }
}<%- parameters.length === 0 ? ');' : ',' %>
<% parameters.forEach(function(param, index) { -%>
<%- param.name %><%- index < parameters.length - 1 ? ',' : ');' %>
<% }); -%>
