<?php
  require_once('../../lib/KalturaClient.php');
  require_once('Credentials.php');

  $config = new KalturaConfiguration(PARTNER_ID);
  $config->serviceUrl = "http://jessex";
  $client = new KalturaClient($config);
  $ks = $client->session->start(
    SECRET,
    USER_ID,
    SESSION_TYPE,
    PARTNER_ID,
    null, null);
  $client->setKS($ks);

  $filter = new KalturaCuePointFilter();
  $filter->entryIdEqual = "1_318vzqcr";

  $pager = new KalturaFilterPager();


  try {
    $result = $client->cuePoint->listAction(
      $filter, 
      $pager);
    $result = (object) $result->objects;
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>

<h1>Cue Points</h1>
<hr></hr>
<?php if($result->length === 0) { ?>
  <i>No cue points found</i>
<?php } ?>
<?php foreach($result as $index=>$cuePoint) { ?>
  <p>
    <?php echo $cuePoint->cuePointType ?> starting at <?php echo $cuePoint->startTime ?> milliseconds
  </p>
<?php } ?>
<form id="AddAdCuePointForm">
  <div class="form-group">
    <label>Start Time (ms)</label>
    <input class="form-control" type="number" name="startTime"></input>
  </div>
  <div class="form-group">
    <label>VAST Source URL</label>
    <input class="form-control" type="text" name="sourceUrl" value="http://projects.kaltura.com/mdale/hotelVastAd.xml"></input>
  </div>
  <div class="form-group">
    <input class="btn btn-success" type="submit" value="Add Cue Point"></input>
  </div>
</form>
<hr></hr>
<div id="CuePointAdded"></div>
<script>
  $('#AddAdCuePointForm').submit(function() {
    var data = new FormData(document.getElementById('AddAdCuePointForm'));
     $.ajax({
       url: '/addCuePoint.php',
       type: 'POST',
       data: data,
       contentType: false,
       cache: false,
       processData: false,
       success: function (data, textStatus, jqXHR) {
         $('.container').load('listCuePoint.php', JSON.parse(data));
       }
     });
    return false;
  })
</script>
<hr></hr>
