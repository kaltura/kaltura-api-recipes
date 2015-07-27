<?php
require_once('../../lib/KalturaClient.php');
$config = new KalturaConfiguration(1760921);
$config->serviceUrl = 'https://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  "8d6cb692ab0f41bfa6bde373204c4b40",
  "lucybot@example.com",
  KalturaSessionType::ADMIN,
  1760921,
  null, null);
$client->setKS($ks);

$filter = new KalturaEventNotificationTemplateFilter();

$pager = new KalturaFilterPager();


$result = $client->eventNotificationTemplate->listAction(
  $filter, 
  $pager);
$result = (object)$result->objects;
include 'KalturaEventNotificationTemplateListResponse.php';
?>