<?php
<% if (showSetup) { -%>
  require_once('lib/KalturaClient.php');

  $config = new KalturaConfiguration(<%- codegen.constant(answers.partnerId) %>);
  $config->serviceUrl = 'https://www.kaltura.com';
  $client = new KalturaClient($config);
  $ks = $client->session->start(
    <%- codegen.constant(answers.secret) %>,
    <%- codegen.constant(answers.userId) %>,
    <%- answers.sessionType === 0 ? 'KalturaSessionType::USER' : 'KalturaSessionType::ADMIN' %>,
    <%- answers.partnerId %>);
  $client->setKS($ks);

<% } -%>
<%  parameters.forEach(function(param) { -%>
<%  var setter = codegen.getFieldSetter(param, [], answers); -%>
<%    if (setter) { -%>
<%- codegen.indent(setter, 2) %>
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
    var_dump($result);
<% } -%>
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>
