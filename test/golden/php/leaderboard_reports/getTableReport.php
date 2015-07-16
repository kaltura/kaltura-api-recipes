<?php
require_once('lib/KalturaClient.php');
$config = new KalturaConfiguration(1760921);
$config->serviceUrl = 'http://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  "8d6cb692ab0f41bfa6bde373204c4b40",
  "lucybot@example.com",
  KalturaSessionType::ADMIN,
  1760921,
  null, null);
$client->setKS($ks);

$reportInputFilter = new KalturaReportInputFilter();

$reportInputFilter->fromDay = "20150615";

$reportInputFilter->toDay = "20150715";
$pager = new KalturaFilterPager();
$reportType = 1;
$order = "count_plays";
$objectIds = null;

$result = $client->report->getTable(
  $reportType, 
  $reportInputFilter, 
  $pager, 
  $order, 
  $objectIds);
$result = (object)$result;
include 'KalturaReportTable.php';
?>