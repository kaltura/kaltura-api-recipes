<?php if(1 == 1) { ?>
  <h1>Report - Top Content</h1>
<?php } ?>
<?php if(1 == 5) { ?>
  <h1>Report - Top Contributors</h1>
<?php } ?>
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