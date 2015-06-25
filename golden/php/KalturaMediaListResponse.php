<?php foreach($result as $index=>$video) { ?>
  <?php if($index < 5) { ?>
    <h2><?= $video->thumbnailUrl ?></h2>
    <p><?= $video->description ?></p>
  <?php } ?>
<?php } ?>
