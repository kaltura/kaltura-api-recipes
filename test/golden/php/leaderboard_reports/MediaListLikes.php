<?php foreach($result as $index=>$video) { ?>
  <h3><?php echo $index + 1 ?>. <?php echo $video->name ?></h3>
  <p>Rank: <?php echo $video->rank ?></p>
<?php } ?>