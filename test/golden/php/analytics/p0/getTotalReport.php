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

$reportInputFilter = new KalturaReportInputFilter();
$reportInputFilter->fromDay = "2015-07-01";
$reportInputFilter->toDay = "2015-07-10";

$reportType = 5;
$objectIds = null;

$result = $client->report->getTotal(
  $reportType, 
  $reportInputFilter, 
  $objectIds);
$result = (object)$result;
include 'KalturaReportTotal.php';
?>