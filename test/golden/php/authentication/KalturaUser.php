<?php if($result->partnerId) { ?>
  <h1>Logged In!</h1>
  <p>Email: <?php echo $result->email ?></p>
  <p>Partner ID: <?php echo $result->partnerId ?></p>
<?php } ?>