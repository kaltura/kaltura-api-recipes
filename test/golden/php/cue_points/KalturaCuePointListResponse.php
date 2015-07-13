<h1>Cue Points</h1>
<hr></hr>
<?php if($result->length === 0) { ?>
  <i>No cue points found</i>
<?php } ?>
<?php foreach($result as $index=>$cuePoint) { ?>
  <p>
  <?php echo $cuePoint->cuePointType ?> starting at <?php echo $cuePoint->startTime ?> milliseconds
  </p>
<?php } ?>
<?php
  include "AddCuePoint.php";
?>
<hr></hr>
<div class="KalturaMediaEntry"></div>
<script>
  var element = $('.KalturaMediaEntry').last();
  element[0].loadData = function() {
    $('.KalturaMediaEntry').last().load('getMedia.php', {
       entryId: "1_318vzqcr",
    });
  }
  element[0].loadData();
</script>