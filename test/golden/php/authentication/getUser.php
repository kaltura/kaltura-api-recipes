<?php
require_once('lib/KalturaClient.php');
$config = new KalturaConfiguration(null);
$config->serviceUrl = 'http://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  null,
  null,
  KalturaSessionType::ADMIN,
  null,
  null, null);
$client->setKS($ks);

$userId = null;

$result = $client->user->get(
  $userId);
$result = (object)$result;
include 'KalturaUser.php';
?>