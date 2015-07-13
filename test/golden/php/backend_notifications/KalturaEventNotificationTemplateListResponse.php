<h1>Notification Templates</h1>
<hr></hr>
<?php foreach($result as $index=>$template) { ?>
  <h3><?php echo $template->name ?></h3>
  <p>Type: <?php echo $template->type ?></p>
  <p>URL: <?php echo $template->url ?></p>
  <p>Conditions: </p>
  <ul>
    <?php foreach($template->eventConditions as $index=>$condition) { ?>
      <li><?php echo $condition->modifiedColumns ?> - <?php echo $condition->description ?></li>
    <?php } ?>
  </ul>
  <hr></hr>
<?php } ?>
<?php
  include "AddNotificationEvent.php";
?>