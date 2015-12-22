<?php foreach($result as $index=>$permission) { ?>
  <?php $result = $permission; ?><h3>Permission <?php echo $result->name ?></h3>
<p>Status: 
  <?php if($result->status == 1) { ?>
    <span>Active</span>
  <?php } ?>
  <?php if($result->status == 2) { ?>
    <span>Blocked</span>
  <?php } ?>
  <?php if($result->status == 3) { ?>
    <span>Deleted</span>
  <?php } ?>
</p>
<?php } ?>
