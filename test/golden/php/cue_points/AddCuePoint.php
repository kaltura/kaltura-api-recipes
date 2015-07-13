<form id="AddCuePointForm" onsubmit="return false">
  <div class="form-group">
    <label>Start Time (ms)</label>
    <input class="form-control" type="number" name="startTime"></input>
  </div>
  <div class="form-group">
    <label>Duration (ms)</label>
    <input class="form-control" type="number" name="duration"></input>
  </div>
  <div class="form-group">
    <input class="btn btn-success" type="submit" value="Add Cue Point"></input>
  </div>
</form>
<script>
  $('#AddCuePointForm').submit(function() {
    var data = new FormData(document.getElementById('AddCuePointForm'));
    console.log('add cp', data);
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