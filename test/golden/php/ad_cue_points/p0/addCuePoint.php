<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration(PARTNER_ID);
$config->serviceUrl = "https://www.kaltura.com/";
$client = new KalturaClient($config);
$ks = $client->session->start(
  SECRET,
  USER_ID,
  SESSION_TYPE,
  PARTNER_ID,
  null, null);
$client->setKS($ks);

$cuePoint = new KalturaAdCuePoint;
$cuePoint->sourceUrl = $_POST["sourceUrl"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = "1_318vzqcr";
$result = $client->cuePoint->add($cuePoint);
echo json_encode($result);
?>