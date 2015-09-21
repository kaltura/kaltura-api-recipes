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
$reportInputFilter->fromDay = "20150615";
$reportInputFilter->toDay = "20150715";

$pager = new KalturaFilterPager();

$reportType = KalturaReportType::USER_TOP_CONTENT;

$order = "count_plays";

$objectIds = null;

try {
  $result = $client->report->getTable(
    $reportType, 
    $reportInputFilter, 
    $pager, 
    $order, 
    $objectIds);
  $result = (object) $result;
?>
<table class="table">
  <tr id="Header"><td><?php echo $result->header ?></td></tr>
  <tr id="Data"><td><?php echo $result->data ?></td></tr>
</table>
<script>
  var getRow = function(csv) {
    return '<tr><td>' + csv.replace(/,/g, '</td><td>') + '</td></tr>';
  }
  var headers = $('#Header td').text();
  var data = $('#Data td').text();
  var rows = data.split(';');
  $('table').html('');
  $('table').append(getRow(headers));
  rows.forEach(function(row) {
    $('table').append(getRow(row));
  })
</script>

<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
