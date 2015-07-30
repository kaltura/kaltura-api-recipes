<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration($PARTNER_ID);
$config->serviceUrl = "https://www.kaltura.com/";
$client = new KalturaClient($config);
$ks = $client->session->start(
  $SECRET,
  $USER_ID,
  $SESSION_TYPE,
  $PARTNER_ID,
  null, null);
$client->setKS($ks);

$filter = new KalturaPermissionFilter();
$filter->nameEqual = "EVENTNOTIFICATION_PLUGIN_PERMISSION";

$pager = new KalturaFilterPager();


$result = $client->permission->listAction(
  $filter, 
  $pager);
$result = (object)$result->objects;
require 'KalturaPermissionListResponse.php';
?>