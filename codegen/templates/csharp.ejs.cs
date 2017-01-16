<% parameters.forEach(function(param) { -%>
<%- codegen.assignment(param, [], answers) %>
<% }) -%>

<% var parameterNames = parameters.map(function(p) {return  p.name}) -%>
Object result = client.<%- codegen.rewriteService(service) %>.<%- codegen.rewriteAction(action) %>(<%- parameterNames.join(', ') %>);
Console.WriteLine(result);
