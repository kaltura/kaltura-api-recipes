<p>Caption file uploaded. Adding to video "1_318vzqcr"</p>
<div class="AttachCaptions"></div>
<script>
  var element = $('.AttachCaptions').last();
  element[0].loadData = function() {
    $('.AttachCaptions').last().load('attachCaptions.php', {
       token: <?php echo json_encode($result->id) ?>,
    });
  }
</script>