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

  $id = $_POST["id"];

  try {
    $result = $client->metadata->deleteAction($id);
    $result = (object) $result;
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>

<div class="info info-success">Deleted</div>
