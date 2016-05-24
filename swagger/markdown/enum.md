# <%- name %>

<% schema.oneOf.forEach(function(val) { -%>
`<%- val.title %>`: <%- JSON.stringify(val.enum[0]) %>

<% }) -%>
