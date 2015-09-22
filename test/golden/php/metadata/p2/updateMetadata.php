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

$id = null;

$xmlData = "<metadata><Somefield>LINUX RULES</Somefield></metadata>";

$version = null;

try {
  $result = $client->metadata->update(
    $id, 
    $xmlData, 
    $version);
  $result = (object) $result;
?>
<?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1><?php } else { ?>
	    <h2>Metadata Object <?php echo $result->name ?></h2>
	    <p><b>ID:</b> <?php echo $result->id ?></p>
	    <p>XML:
	    <pre>
	    <?php echo htmlspecialchars($result->xml) ?>
	    </pre>
	    </p>
<?php } ?>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
