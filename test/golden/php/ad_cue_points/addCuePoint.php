<?php
require_once('lib/KalturaClient.php');
$config = new KalturaConfiguration(1760921);
$config->serviceUrl = 'http://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  "8d6cb692ab0f41bfa6bde373204c4b40",
  "lucybot@example.com",
  KalturaSessionType::ADMIN,
  1760921,
  null, null);
$client->setKS($ks);

$cuePoint = new KalturaAdCuePoint;
$cuePoint->sourceUrl = $_POST["sourceUrl"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = "1_318vzqcr";
$result = $client->cuePoint->add($cuePoint);
echo json_encode($result);
?>