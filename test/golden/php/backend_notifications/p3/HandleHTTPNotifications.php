<?php
  require_once('../../lib/KalturaClient.php');
  require_once('Credentials.php');

  $config = new KalturaConfiguration(PARTNER_ID);
  $config->serviceUrl = "http://jessex";
  $client = new KalturaClient($config);
  $ks = $client->session->start(
    SECRET,
    USER_ID,
    SESSION_TYPE,
    PARTNER_ID,
    null, null);
  $client->setKS($ks);

  require_once('lib/KalturaClient.php');
  require_once('lib/KalturaPlugins/KalturaHttpNotificationClientPlugin.php');

  $object = unserialize($_POST['data']);
?>
