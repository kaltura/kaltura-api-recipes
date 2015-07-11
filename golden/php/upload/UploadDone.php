<p>Uploaded file <?= $result->fileName ?>. Creating entry...</p>
<div class="CreatedEntry"></div>
<script>
  var element = $('.CreatedEntry').last();
  element[0].loadData = function() {
    $('.CreatedEntry').last().load('addFromUploadedFileBaseEntry.php', {
       name: <?= json_encode($result->fileName) ?>,
       uploadTokenId: <?= json_encode($result->id) ?>,
    });
  }
  element[0].loadData();
</script>
