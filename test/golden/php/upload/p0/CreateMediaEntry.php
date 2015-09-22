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

$entry = new KalturaMediaEntry();
$entry->name = $_POST["name"];
$entry->mediaType = 1;
$entry = $client->media->add($entry);
$mediaResource = new KalturaUploadedFileTokenResource();
$mediaResource->token = $_POST["uploadTokenId"];

$result = $client->media->addContent($entry->id, $mediaResource);
while ($result->status != 2) {
  sleep(1);
  $result = $client->media->get($result->id);
}
$result = (object)$result;
require 'KalturaMediaEntry.php';
?>
