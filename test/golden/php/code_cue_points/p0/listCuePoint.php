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

$filter = new KalturaCuePointFilter();
$filter->cuePointTypeEqual = "codeCuePoint.Code";
$filter->entryIdEqual = "1_318vzqcr";

$pager = new KalturaFilterPager();


$result = $client->cuePoint->listAction(
  $filter, 
  $pager);
$result = (object)$result->objects;
require 'CodeCuePointListResponse.php';
?>