<form id="AddAppTokenForm">
  <div class="form-group">
    <label>Session Type</label>
    <select class="form-control" name="sessionType">
      <option value="0">Admin</option>
      <option value="2">User</option>
    </select>
  </div>
  <div class="form-group">
    <label>Session Duration (ms)</label>
    <input class="form-control" type="number" name="sessionDuration"></input>
  </div>
  <div class="form-group">
    <input class="btn btn-success" type="submit" value="Add App Token"></input>
  </div>
</form>
<script>
  $('#AddAppTokenForm').submit(function() {
    var data = new FormData(document.getElementById('AddAppTokenForm'));
    data.sessionType = parseInt(data.sessionType);
     $.ajax({
       url: '/addAppToken.php',
       type: 'POST',
       data: data,
       contentType: false,
       cache: false,
       processData: false,
       success: function (data, textStatus, jqXHR) {
         $('.container').load('listAppToken.php', JSON.parse(data));
       }
     });
    return false;
  })
</script>