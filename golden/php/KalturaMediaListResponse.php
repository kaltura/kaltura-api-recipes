<?php foreach($result as $index=>$video) { ?>
  <?php if($index < 5) { ?>
    <?php
  $result = $video;
  include "KalturaMediaEntry.php";
?>
  <?php } ?>
<?php } ?>
