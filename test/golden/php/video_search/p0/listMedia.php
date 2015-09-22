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

$filter = new KalturaMediaEntryFilter();
$filter->orderBy = "-createdAt";
$filter->advancedSearch = new KalturaMetadataSearchItem();

$pager = new KalturaFilterPager();


try {
  $result = $client->media->listAction(
    $filter, 
    $pager);
  $result = (object)$result->objects;
  require 'KalturaMediaListResponse.php';
} catch (Exception $e) {
  echo $e->getMessage();
}
?>
