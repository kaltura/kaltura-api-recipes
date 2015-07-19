<table class="table">
  <tr>
    <td></td><td>Name</td><td>Rank</td><td>Votes</td></tr>
  
<?php foreach($result as $index=>$video) { ?>
  <tr>
    <td><?php echo $index + 1 ?></td>
    <td><?php echo $video->name ?></td>
    <td><?php echo $video->rank ?></td>
    <td><?php echo $video->votes ?></td>
  </tr>
<?php } ?>
</table>