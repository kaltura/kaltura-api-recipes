<%  parameters.forEach(function(param) { -%>
<%  var setter = helper.getFieldSetter(param, [], answers); %>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>
<%  }) -%>

try {
  $result = $client-><%- service %>-><%- action %>(<%- -%>
<% if (parameters.length === 0) { -%>
<%- ');' %>
<% } else if (parameters.length === 1) { -%>
$<%- parameters[0].name %>);
<% } else { -%>

<% parameters.forEach(function(param, index) { -%>
    $<%- param.name %><%- index < parameters.length -1 ? ', ' : ');' %>
<% }); -%>
  echo $result;
<% } -%>
} catch (Exception $e) {
  echo $e->getMessage();
}
