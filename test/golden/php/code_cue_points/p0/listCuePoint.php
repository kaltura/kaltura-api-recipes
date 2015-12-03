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

$filter = new KalturaCuePointFilter();
$filter->cuePointTypeEqual = KalturaCuePointType::CODE;
$filter->entryIdEqual = "1_318vzqcr";

$pager = new KalturaFilterPager();


try {
  $result = $client->cuePoint->listAction(
    $filter, 
    $pager);
  $result = (object) $result->objects;
?>
<h1>Cue Points</h1>
<hr></hr>
<?php if($result->length === 0) { ?>
  <i>No cue points found</i>
<?php } ?>
<?php foreach($result as $index=>$cuePoint) { ?>
  <h3><?php echo $cuePoint->code ?></h3>
  <p><?php echo $cuePoint->startTime ?>ms - <?php echo $cuePoint->endTime ?>ms</p>
  <p><?php echo $cuePoint->description ?></p>
<?php } ?>
<form id="AddCodeCuePointForm">
  <div class="form-group">
    <label>Code</label>
    <input class="form-control" type="text" name="code"></input>
  </div>
  <div class="form-group">
    <label>Description</label>
    <input class="form-control" type="text" name="description"></input>
  </div>
  <div class="form-group">
    <label>Start Time (ms)</label>
    <input class="form-control" type="number" name="startTime"></input>
  </div>
  <div class="form-group">
    <input class="btn btn-success" type="submit" value="Add Cue Point"></input>
  </div>
</form>
<hr></hr>
<div id="CodeCuePointAdded"></div>
<script>
  $('#AddCodeCuePointForm').submit(function() {
    var data = new FormData(document.getElementById('AddCodeCuePointForm'));
     $.ajax({
       url: '/addCodeCuePoint.php',
       type: 'POST',
       data: data,
       contentType: false,
       cache: false,
       processData: false,
       success: function (data, textStatus, jqXHR) {
         $('.container').html(data);
       }
     });
    return false;
  })
</script>
<hr></hr>
<?php

} catch (Exception $e) {
  echo $e->getMessage();
}
?>
