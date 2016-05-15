<?php
<% if (showSetup) { -%>
  require_once('lib/KalturaClient.php');

  $config = new KalturaConfiguration(<%- helper.getValue(answers.partnerId) %>);
  $client = new KalturaClient($config);
  $ks = $client->session->start(
    <%- helper.getValue(answers.secret) %>,
    <%- helper.getValue(answers.userId) %>,
    <%- answers.sessionType === 0 ? 'Kaltura.enums.KalturaSessionType.USER' : 'Kaltura.enums.KalturaSessionType.ADMIN' %>,
    <%- answers.partnerId %>);
  $client->setKS($ks);

<% } -%>
<%  parameters.forEach(function(param) { -%>
<%  var setter = helper.getFieldSetter(param, [], answers); -%>
<%    if (setter) { -%>
<%- helper.indent(setter, 2) %>
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
