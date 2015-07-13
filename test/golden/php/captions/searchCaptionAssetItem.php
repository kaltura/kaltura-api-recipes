<?php
require_once('lib/KalturaClient.php');
$config = new KalturaConfiguration(1760921);
$config->serviceUrl = 'http://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  "8d6cb692ab0f41bfa6bde373204c4b40",
  null,
  KalturaSessionType::ADMIN,
  1760921,
  null, null);
$client->setKS($ks);

$entryFilter = new KalturaBaseEntryFilter();
$captionAssetItemFilter = new KalturaCaptionAssetItemFilter();
$captionAssetItemPager = new KalturaFilterPager();

$result = $client->captionAssetItem->search(
  $entryFilter, 
  $captionAssetItemFilter, 
  $captionAssetItemPager);
$result = (object)$result->objects;
include 'CaptionSearch.php';
?>