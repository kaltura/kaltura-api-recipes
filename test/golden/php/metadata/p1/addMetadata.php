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

$metadataProfileId = null;
$objectType = KalturaMetadataObjectType::ENTRY;

$objectId = null;

$xmlData = null;

try {
  $result = $client->metadata->add(
    $metadataProfileId, 
    $objectType, 
    $objectId, 
    $xmlData);
  $result = (object)$result;
  require 'metadataShow.php';
} catch (Exception $e) {
  echo $e->getMessage();
}
?>
