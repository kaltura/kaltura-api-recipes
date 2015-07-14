<h1>My App Tokens</h1>
<hr></hr>
<?php foreach($result as $index=>$appToken) { ?>
  <h3>Token ID <?php echo $appToken->id ?></h3>
  <p>Token: <?php echo $appToken->token ?></p>
  <p>Type: 
    <?php if($appToken->sessionType == 0) { ?>
      <span>Admin</span>
    <?php } ?>
    <?php if($appToken->sessionType == 2) { ?>
      <span>User</span>
    <?php } ?>
  </p>
  <p>Duration: <?php echo $appToken->sessionDuration ?></p>
  <p>
    Status: 
    <?php if($appToken->status == 1) { ?>
      <span>Disabled</span>
    <?php } ?>
    <?php if($appToken->status == 2) { ?>
      <span>Active</span>
    <?php } ?>
    <?php if($appToken->status == 3) { ?>
      <span>Deleted</span>
    <?php } ?>
  </p>
  <hr></hr>
<?php } ?>
<?php
  include "AddAppToken.php";
?>