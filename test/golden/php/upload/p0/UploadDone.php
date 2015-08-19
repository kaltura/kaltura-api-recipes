<script>
  $('#UploadStatus').text('Uploaded file <?php echo $result->fileName ?>. Creating entry...');
</script>

<div class="KalturaMediaEntry"></div>
<script>
  var element = $('.KalturaMediaEntry').last();
  element[0].loadData = function() {
    $('.KalturaMediaEntry').last().load('CreateMediaEntry.php', {
       name: <?php echo json_encode($result->fileName) ?>,
       uploadTokenId: <?php echo json_encode($result->id) ?>,
    });
  }
  element[0].loadData();
</script>
