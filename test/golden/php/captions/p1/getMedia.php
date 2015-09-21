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

$entryId = "1_9kdmnhuv";

$version = null;

try {
  $result = $client->media->get(
    $entryId, 
    $version);
  $result = (object) $result;
?>
<div class="row" style="margin-bottom: 10px">
  <div class="col-xs-12 col-md-5">
    <h2><?php echo $result->name ?></h2>
    <p><?php echo $result->description ?></p>
  </div>
  <div class="col-xs-12 col-md-6 col-md-offset-1">
    <script src="https://cdnapisec.kaltura.com/p/<?php echo $result->partnerId ?>/sp/<?php echo $result->partnerId ?>00/embedIframeJs/uiconf_id/30633631/partner_id/<?php echo $result->partnerId ?>">
    </script>
    <div id="kaltura_player_<?php echo $result->id ?>" style="width: 560px; height: 395px;">
    </div>
    <script>
    kWidget.thumbEmbed({
      "targetId": "kaltura_player_<?php echo $result->id ?>",
      "wid": "_<?php echo $result->partnerId ?>",
      "uiconf_id": 30633631,
      "flashvars": {},
      "cache_st": 1437326770,
      "entry_id": "<?php echo $result->id ?>"
    });
    </script>
  </div>
</div>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
