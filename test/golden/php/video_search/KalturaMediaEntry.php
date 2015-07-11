<div class="row" style="margin-bottom: 10px">
  <div class="col-xs-12 col-md-5">
    <h2><?php echo $result->name ?></h2>
    <p><?php echo $result->description ?></p>
  </div>
  <div class="col-xs-12 col-md-6 col-md-offset-1">
    <div id="kaltura_player_<?php echo $result->id ?>" style="width: 560px; height: 395px;">
      <script src="https://cdnapisec.kaltura.com/p/<?php echo $result->partnerId ?>/sp/<?php echo $result->partnerId ?>00/embedIframeJs/uiconf_id/null/partner_id/<?php echo $result->partnerId ?>?autoembed=true&entry_id=<?php echo $result->id ?>&playerId=kaltura_player_<?php echo $result->id ?>&cache_st=1435602081&width=560&height=395">
      </script>
    </div>
  </div>
</div>