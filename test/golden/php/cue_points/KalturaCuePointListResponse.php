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