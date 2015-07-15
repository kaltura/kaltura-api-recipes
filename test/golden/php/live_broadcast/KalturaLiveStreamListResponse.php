<h1>My Streams</h1>
<hr></hr>
<?php foreach($result as $index=>$stream) { ?>
  <h3><?php echo $stream->streamName ?></h3>
  <p>Stream URL: <a href="<?php echo $stream->streamUrl ?>" target="_blank"><?php echo $stream->streamUrl ?></a></p>
<?php } ?>
<?php
  include "AddLiveStream.php";
?>