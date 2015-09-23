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
    $('#' + playerId)[0].addJsListener( "cuePointReached", "writeLog" );
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
