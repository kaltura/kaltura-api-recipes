<% parameters.filter(function(param) {return param.fields}).forEach(function(param, index) { -%>
$<%- param.name %> = new <%- param.class %>();
<%   param.fields.forEach(function(field) { -%>
$<%- param.name %>-><%- field.name %> = <%- '<\%- Lucy.code.variable("answers.' + field.name + '") %\>' %>;
<%   }); -%>
<% }); -%>
<% parameters.filter(function(param) {return !param.fields}).forEach(function(param, index) { -%>
$<%- param.name %> = <%- '<\%- Lucy.code.variable("answers.' + param.name + '") %\>' %>;
<% }); -%>

$result = $client-><%- service %>-><%- action %>(<%- parameters.length === 0 ? ');' : '' %>
<% parameters.forEach(function(param, index) { -%>
  $<%- param.name %><%- index < parameters.length -1 ? ', ' : ');' %>
<% }); -%>
<% if (returns === 'list') { -%>
<%- '<\%- Lucy.returnCode("$result->objects") %\>' %>
<% } else { -%>
<%- '<\%- Lucy.returnCode("$result") %\>' %>
<% } -%>
