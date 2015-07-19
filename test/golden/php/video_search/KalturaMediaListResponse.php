<h1>Videos</h1>
<hr></hr>
<?php foreach($result as $index=>$video) { ?>
  <?php if($index < 5) { ?>
    <?php
      $result = $video;
      include "KalturaMediaEntry.php";
    ?>
  <?php } ?>
<?php } ?>