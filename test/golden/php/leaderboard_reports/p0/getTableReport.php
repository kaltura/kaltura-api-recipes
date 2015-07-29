<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration($PARTNER_ID);
$config->serviceUrl = 'https://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  $SECRET,
  $USER_ID,
  $SESSION_TYPE,
  $PARTNER_ID,
  null, null);
$client->setKS($ks);

$reportInputFilter = new KalturaReportInputFilter();
$reportInputFilter->fromDay = "20150615";
$reportInputFilter->toDay = "20150715";

$pager = new KalturaFilterPager();

$reportType = 13;
$order = "count_plays";
$objectIds = null;

$result = $client->report->getTable(
  $reportType, 
  $reportInputFilter, 
  $pager, 
  $order, 
  $objectIds);
$result = (object)$result;
require 'KalturaReportTable.php';
?>