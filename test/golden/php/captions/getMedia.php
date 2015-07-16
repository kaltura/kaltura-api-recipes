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

$entryId = "1_318vzqcr";
$version = null;

$result = $client->media->get(
  $entryId, 
  $version);
$result = (object)$result;
include 'KalturaMediaEntry.php';
?>