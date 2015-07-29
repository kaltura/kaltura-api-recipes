<h1>Cue Points</h1>
<hr></hr>
<?php if($result->length === 0) { ?>
  <i>No cue points found</i>
<?php } ?>
<?php foreach($result as $index=>$cuePoint) { ?>
  <h3><?php echo $cuePoint->code ?></h3>
  <p><?php echo $cuePoint->startTime ?>ms - <?php echo $cuePoint->endTime ?>ms</p>
  <p><?php echo $cuePoint->description ?></p>
<?php } ?>
<?php
  require "AddCodeCuePoint.php";
?>
<hr></hr>