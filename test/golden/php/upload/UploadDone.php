<p>Uploaded file <?php echo $result->fileName ?>. Creating entry...</p>
<div class="CreatedEntry"></div>
<script>
  var element = $('.CreatedEntry').last();
  element[0].loadData = function() {
    $('.CreatedEntry').last().load('CreateBaseEntry.php', {
       name: <?php echo json_encode($result->fileName) ?>,
       uploadTokenId: <?php echo json_encode($result->id) ?>,
    });
  }
  element[0].loadData();
</script>