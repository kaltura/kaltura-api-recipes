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

$captionAssetId = null;

try {
  $result = $client->captionAsset->get(
    $captionAssetId);
  $result = (object)$result;
  require 'KalturaCaptionAsset.php';
} catch (Exception $e) {
  echo $e->getMessage();
}
?>
