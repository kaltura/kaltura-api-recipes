<h3><?php echo $result->id ?> - <?php echo $result->name ?></h3>
<p>System Name: <?php echo $result->systemName ?></p>
<p>Type: <?php echo $result->type ?></p>
<?php if($result->type == 'httpNotification.Http') { ?>
  <p>URL: <?php echo $result->url ?></p>
<?php } ?>
<?php if($result->type == 'emailNotification.Email') { ?>
  <p>Subject: <?php echo $result->subject ?></p>
  <div style="font-size: 12px">
    <?php echo $result->body ?>
  </div>
<?php } ?>
<hr></hr>