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
require 'KalturaReportTotal.php';
?>