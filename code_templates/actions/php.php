<% parameters.forEach(function(param, index) { -%>
$<%- param.name %> = new <%- param.class %>();
<%   param.fields.forEach(function(field) { -%>
$<%- param.name %>-><%- field.name %> = <%- field.value %>;
<%   }); -%>
<% }); -%>

$result = $client-><%- service %>-><%- action %>(<%- parameters.length === 0 ? ');' : '' %>
<% parameters.forEach(function(param, index) { -%>
  $<%- param.name %><%- index < parameters.length -1 ? ', ' : ');' %>
<% }); -%>
<%- '<\%- Lucy.returnCode("$result->objects") %\>' %>
