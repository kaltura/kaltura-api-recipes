$cuePoint = new KalturaAdCuePoint;
$cuePoint->duraton = $_POST["duration"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
$result = $client->cuePoint->add($cuePoint);
echo json_encode($result);
