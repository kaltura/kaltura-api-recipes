$id = <%- Lucy.code.variable('answers.id') %>;
$uiConf = new KalturaUiConf();
$uiConf->config = $_POST["config"];
$result = $client->uiConf->update($id, $uiConf);
<%- Lucy.returnCode('$result') %>
