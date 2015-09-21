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

$userId = USER_ID;

try {
  $result = $client->user->get(
    $userId);
  $result = (object)$result;
  ?>
<div id="ErrorMessage" class="alert alert-danger" style="display: none">
</div>
<?php if($result->partnerId) { ?>
  <h1>Logged In!</h1>
  <p>Email: <?php echo $result->email ?></p>
  <p>Partner ID: <?php echo $result->partnerId ?></p>
<?php } ?>

<?php
} catch (Exception $e) {
  $result = array(
    code => $e->getCode(),
    message => $e->getMessage()
  );
  $result = (object)$result;
  ?>
<div id="ErrorMessage" class="alert alert-danger" style="display: none">
</div>
<?php if($result->partnerId) { ?>
  <h1>Logged In!</h1>
  <p>Email: <?php echo $result->email ?></p>
  <p>Partner ID: <?php echo $result->partnerId ?></p>
<?php } ?>

<?php
}
?>
