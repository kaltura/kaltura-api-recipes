<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration($PARTNER_ID);
$config->serviceUrl = "https://www.kaltura.com/";
$client = new KalturaClient($config);
$ks = $client->session->start(
  $SECRET,
  $USER_ID,
  $SESSION_TYPE,
  $PARTNER_ID,
  null, null);
$client->setKS($ks);

$cuePoint = new KalturaCodeCuePoint;
$cuePoint->code = $_POST["code"];
$cuePoint->description = $_POST["description"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = "1_318vzqcr";
$result = $client->cuePoint->add($cuePoint);
$result = (object)$result;
require 'CodeCuePointAdded.php';
?>