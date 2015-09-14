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

$metadataProfile = new KalturaMetadataProfile();
$metadataProfile->metadataObjectType = KalturaMetadataObjectType::ENTRY;
$metadataProfile->createMode = KalturaMetadataProfileCreateMode::API;


$xsdData = "<xsd:schema></xsd:schema>";

$viewsData = null;

try {
  $result = $client->metadataProfile->add(
    $metadataProfile, 
    $xsdData, 
    $viewsData);
  $result = (object)$result;
  require 'metadataProfileShow.php';
} catch (Exception $e) {
  $result = array(
    code => $e->getCode(),
    message => $e->getMessage()
  );
  $result = (object)$result;
  require 'metadataProfileShow.php';
}
?>
