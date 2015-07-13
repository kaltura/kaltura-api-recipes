<script src="http://player.kaltura.com/mwEmbedLoader.php"></script>
<script src="http://player.kaltura.com/kWidget/kWidget.auth.js"></script>
<script src="/js/kaltura_thumb_rotator.js"></script>
<div class="row">
  <div class="col-xs-12 text-center">
    <div id="kaltura_player" style="width: 420px; height: 300px;">
      <script src="https://cdnapisec.kaltura.com/p/1760921/sp/176092100/embedIframeJs/uiconf_id/28959921/partner_id/1760921?autoembed=true&playerId=kaltura_player&cache_st=1435602081&width=420&height=300">
      </script>
    </div>
  </div>
</div>
<hr></hr>
<div class="row">
  <?php foreach($result as $index=>$video) { ?>
    <?php if($index < 10) { ?>
        <div class="col-xs-3 text-center" style="margin-bottom: 10px;">
          <img src="https://cdnapisec.kaltura.com/p/<?php echo $video->partnerId ?>/thumbnail/entry_id/<?php echo $video->id ?>/width/240/height/180" width="240" height="180" onmouseover="KalturaThumbRotator.start(this)" onmouseout="KalturaThumbRotator.end(this)" onclick="$('#kaltura_player')[0].sendNotification('changeMedia', {entryId: '<?php echo $video->id ?>'})"></img>
        </div>
    <?php } ?>
  <?php } ?>
</div>