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

$reportType = KalturaReportType::TOP_CONTRIBUTORS;

$objectIds = null;

try {
  $result = $client->report->getTotal(
    $reportType, 
    $reportInputFilter, 
    $objectIds);
  $result = (object) $result;
?>
<table class="table">
  <tr id="Header"><td><?php echo $result->header ?></td></tr>
  <tr id="Data"><td><?php echo $result->data ?></td></tr>
</table>
<script>
  var cur = $('#Header').html()
  $('#Header').html(cur.replace(/,/g, '</td><td>'));
  cur = $('#Data').html()
  $('#Data').html(cur.replace(/,/g, '</td><td>'));
</script>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
