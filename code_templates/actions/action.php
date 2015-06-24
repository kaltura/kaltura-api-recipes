<% objects.forEach(function(obj, index) { -%>
$<%- obj.name %> = new <%- obj.class %>();
<%   obj.parameters.forEach(function(param) { -%>
$<%- obj.name %>-><%- param.name %> = <%- param.value %>;
<%   }); -%>
<% }); -%>

$result = client-><%- service %>-><%- action %>(
<% objects.forEach(function(obj, index) { -%>
  $<%- obj.name %>
<% }); -%>);
