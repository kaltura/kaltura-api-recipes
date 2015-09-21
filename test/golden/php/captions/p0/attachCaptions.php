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

move_uploaded_file($_FILES["fileData"]["tmp_name"], $_FILES["fileData"]["name"]);
$uploadToken = new KalturaUploadToken();
$result = $client->uploadToken->add($uploadToken);
$tok=$result->id;
$resume = null;
$finalChunk = null;
$resumeAt = null;
$result = $client->uploadToken->upload($tok, $_FILES["fileData"]["name"], $resume, $finalChunk, $resumeAt);

$captionResource = new KalturaUploadedFileTokenResource();
$captionResource->token = $result->id;
$captionAsset = new KalturaCaptionAsset();
$captionAsset->format = KalturaCaptionType::SRT;
$captionAsset->isDefault = true;
$captionAsset->language = KalturaLanguage::EN;
$captionAsset->label = 'English';
$newAsset = $client->captionAsset->add("1_9kdmnhuv", $captionAsset);
$client->captionAsset->setContent($newAsset->id, $captionResource);
$result = (object)$result;
?>
<p>Captions attached!</p>
<div class="KalturaMediaEntry"></div>
<script>
  var element = $('.KalturaMediaEntry').last();
  element[0].loadData = function() {
    $('.KalturaMediaEntry').last().load('getMedia.php');
  }
  element[0].loadData();
</script>


<?php
?>
