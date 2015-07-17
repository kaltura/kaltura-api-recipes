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

$filter = new KalturaMediaEntryFilter();

$pager = new KalturaFilterPager();


$result = $client->media->listAction(
  $filter, 
  $pager);
$result = (object)$result->objects;
include 'KalturaMediaListResponse.php';
?>