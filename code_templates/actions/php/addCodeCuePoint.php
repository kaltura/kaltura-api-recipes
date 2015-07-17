$cuePoint = new KalturaCodeCuePoint;
$cuePoint->code = $_POST["code"];
$cuePoint->description = $_POST["description"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
$result = $client->cuePoint->add($cuePoint);
<%- Lucy.returnCode('$result') %>
