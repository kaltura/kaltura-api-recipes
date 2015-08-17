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
