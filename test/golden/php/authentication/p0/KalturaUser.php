<div id="ErrorMessage" class="alert alert-danger" style="display: none">
</div>
<?php if($result->message && $result->code) { ?>
  <h1><?php echo $result->message ?></h1>
<?php } ?>
<?php if($result->partnerId) { ?>
  <h1>Logged In!</h1>
  <p>Partner ID: <?php echo $result->partnerId ?></p>
  <p>Screen Name: <?php echo $result->screenName ?></p>
  <p>Name: <?php echo $result->fullName ?></p>
<?php } ?>
