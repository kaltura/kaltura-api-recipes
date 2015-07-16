$cuePoint = new KalturaAdCuePoint;
$cuePoint->sourceUrl = $_POST["sourceUrl"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
$result = $client->cuePoint->add($cuePoint);
echo json_encode($result);
