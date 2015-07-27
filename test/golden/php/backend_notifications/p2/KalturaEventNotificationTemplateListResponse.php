<h1>Notification Templates</h1>
<hr></hr>
<?php foreach($result as $index=>$template) { ?>
  <?php
  $result = $template;
  include "KalturaEventNotificationTemplate.php";
?>
<?php } ?>