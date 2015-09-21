<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration(PARTNER_ID);
$config->serviceUrl = "https://www.kaltura.com/";
$client = new KalturaClient($config);
$ks = $client->session->start(
  SECRET,
  USER_ID,
  SESSION_TYPE,
  PARTNER_ID,
  null, null);
$client->setKS($ks);

$filter = new KalturaEventNotificationTemplateFilter();

$pager = new KalturaFilterPager();


try {
  $result = $client->eventNotificationTemplate->listAction(
    $filter, 
    $pager);
  $result = (object) $result->objects;
?>
<h1>Notification Templates</h1>
<hr></hr>
<?php foreach($result as $index=>$template) { ?>
  <?php $result = $template; ?><h3><?php echo $result->id ?> - <?php echo $result->name ?></h3>
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


<?php } ?>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
