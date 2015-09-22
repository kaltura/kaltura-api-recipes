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

$filter = new KalturaAssetFilter();

$pager = new KalturaFilterPager();


try {
  $result = $client->captionAsset->listAction(
    $filter, 
    $pager);
  $result = (object) $result->objects;
?>
<h1>Assets</h1>
<hr></hr>
<?php foreach($result as $index=>$asset) { ?>
  <?php if($index < 5) { ?>
    <?php $result = $asset; ?><div id="ErrorMessage" class="alert alert-danger" style="display: none">
    </div>
    <?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1><?php } else { ?>
    		  <h1>Caption Asset info:</h1>
    		  <p>Caption Asset ID: <?php echo $result->id ?></p>
    		  <p>Language: <?php echo $result->language ?></p>
    		  <p>Size: <?php echo $result->size ?></p>
    <?php } ?>

  <?php } ?>
<?php } ?>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
