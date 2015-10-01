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

$filter = new KalturaMediaEntryFilter();

$pager = new KalturaFilterPager();


try {
  $result = $client->media->listAction(
    $filter, 
    $pager);
  $result = (object) $result->objects;
?>
<script src="/js/kaltura_thumb_rotator.js"></script>
<style>
  .player-col {
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.75);
    padding: 15px;
  }
</style>
<div class="row">
  <div class="player-col col-xs-8 col-xs-offset-2 text-center">
    <div id="kaltura_player" style="width: 420px; height: 300px; margin: auto;">
      <script src="https://cdnapisec.kaltura.com/p/1760921/sp/176092100/embedIframeJs/uiconf_id/30633631/partner_id/1760921?autoembed=true&playerId=kaltura_player&cache_st=1435602081&width=420&height=300">
      </script>
    </div>
    <p class="small">Click on a thumbnail to choose a video</p>
  </div>
</div>
<hr></hr>
<?php foreach($result as $index=>$video) { ?>
  <?php if($index < 10) { ?>
    <div class="row">
      <div class="col-xs-3 text-center">
        <img src="https://cdnapisec.kaltura.com/p/<?php echo $video->partnerId ?>/thumbnail/entry_id/<?php echo $video->id ?>/width/240/height/180" width="240" height="180" onmouseover="KalturaThumbRotator.start(this)" onmouseout="KalturaThumbRotator.end(this)" onclick="$('#kaltura_player')[0].sendNotification('changeMedia', {entryId: '<?php echo $video->id ?>'})"></img>
      </div>
      <div class="col-xs-8 col-xs-offset-1">
        <h3><?php echo $video->name ?></h3>
        <p><?php echo $video->description ?></p>
        <p>
          <a href="<?php echo $video->downloadUrl ?>" target="_blank"><?php echo $video->downloadUrl ?></a>
        </p>
      </div>
    </div>
    <hr></hr>
  <?php } ?>
<?php } ?>
<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
