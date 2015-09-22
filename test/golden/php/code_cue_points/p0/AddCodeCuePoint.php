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
