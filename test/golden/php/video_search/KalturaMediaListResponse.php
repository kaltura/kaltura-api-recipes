<h1>Videos</h1>
<hr></hr>
<?php if($result->length == 0) { ?>
  <p><i>No results</i></p>
<?php } ?>
<?php foreach($result as $index=>$video) { ?>
  <?php if($index < 5) { ?>
    <?php
      $result = $video;
      include "KalturaMediaEntry.php";
    ?>
  <?php } ?>
<?php } ?>