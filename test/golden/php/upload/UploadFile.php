<?php
require_once('../lib/KalturaClient.php');
$config = new KalturaConfiguration(1760921);
$config->serviceUrl = 'https://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  "8d6cb692ab0f41bfa6bde373204c4b40",
  "lucybot@example.com",
  KalturaSessionType::ADMIN,
  1760921,
  null, null);
$client->setKS($ks);

move_uploaded_file($_FILES["fileData"]["tmp_name"], $_FILES["fileData"]["name"]);
$uploadToken = new KalturaUploadToken();
$result = $client->uploadToken->add($uploadToken);
$tok=$result->id;
$resume = null;
$finalChunk = null;
$resumeAt = null;
$result = $client->uploadToken->upload($tok, $_FILES["fileData"]["name"], $resume, $finalChunk, $resumeAt);
$result = (object)$result;
include 'UploadDone.php';
?>