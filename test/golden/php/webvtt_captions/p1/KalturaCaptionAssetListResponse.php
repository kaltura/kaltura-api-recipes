<h1>Assets</h1>
<hr></hr>
<?php foreach($result as $index=>$asset) { ?>
  <?php if($index < 5) { ?>
    <?php
      $result = $asset;
      require "KalturaCaptionAsset.php";
    ?>
  <?php } ?>
<?php } ?>
