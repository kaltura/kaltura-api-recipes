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

$entryFilter = new KalturaBaseEntryFilter();

$captionAssetItemFilter = new KalturaCaptionAssetItemFilter();
$captionAssetItemFilter->contentLike = "support";

$captionAssetItemPager = new KalturaFilterPager();


try {
  $result = $client->captionAssetItem->search(
    $entryFilter, 
    $captionAssetItemFilter, 
    $captionAssetItemPager);
  $result = (object)$result->objects;
  require 'CaptionSearch.php';
} catch (Exception $e) {
  $result = array(
    code => $e->getCode(),
    message => $e->getMessage()
  );
  $result = (object)$result;
  require 'CaptionSearch.php';
}
?>