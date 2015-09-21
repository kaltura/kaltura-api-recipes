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

$filter = new KalturaPermissionFilter();
$filter->nameEqual = "EVENTNOTIFICATION_PLUGIN_PERMISSION";

$pager = new KalturaFilterPager();


try {
  $result = $client->permission->listAction(
    $filter, 
    $pager);
  $result = (object)$result->objects;
  ?>
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

<?php
} catch (Exception $e) {
  $result = array(
    code => $e->getCode(),
    message => $e->getMessage()
  );
  $result = (object)$result;
  ?>
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

<?php
}
?>
