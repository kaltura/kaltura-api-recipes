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

$entry = new KalturaBaseEntry();
$entry->name = $_POST["name"];
$uploadTokenId = $_POST["uploadTokenId"];

$result = $client->baseEntry->addFromUploadedFile($entry, $uploadTokenId);
while ($result->status != 2) {
  sleep(.1);
  $result = $client->media->get($result->id);
}
$result = (object)$result;
include 'CreatedEntry.php';
?>