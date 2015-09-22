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

$cuePoint = new KalturaCodeCuePoint;
$cuePoint->code = $_POST["code"];
$cuePoint->description = $_POST["description"];
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = "1_318vzqcr";
$result = $client->cuePoint->add($cuePoint);
$result = (object) $result;
?>
<div id="CuePoints">
  <table class="table">
    <tr>
      <td>Code</td>
      <td>Start Time</td>
      <td>End Time</td>
    </tr>
  </table>
</div>
<hr></hr>
<div class="KalturaMediaEntry"></div>
<script>
  var element = $('.KalturaMediaEntry').last();
  element[0].loadData = function() {
    $('.KalturaMediaEntry').last().load('getMedia.php', {
       entryId: "1_318vzqcr",
    });
  }
  element[0].loadData();
</script>

<script>
  jsCallbackReady = function(playerId) {
    $('#' + playerId)[0].addJsListener("cuePointReached", "writeLog");
    window['writeLog'] = function(result) {
      var cuePoint = result.cuePoint
      $('table').append(
        '<tr><td>' + cuePoint.code +
        '</td><td>' + cuePoint.startTime +
        '</td><td>' + cuePoint.endTime + '</td></tr>'
      );
    }
  }
</script>
<?php
?>
