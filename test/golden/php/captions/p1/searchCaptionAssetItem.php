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
  $result = (object) $result->objects;
?>
<h1>Search Results for support</h1>
<hr></hr>
<?php foreach($result as $index=>$caption) { ?>
  <div class="row">
    <div class="col-xs-4 text-right">
      <img src="<?php echo $caption->entry->thumbnailUrl ?>"></img>
    </div>
    <div class="col-xs-7 col-xs-offset-1">
      <p><i><?php echo $caption->content ?></i></p>
    </div>
  </div>
  <hr></hr>
<?php } ?>
<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
