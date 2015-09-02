<p>Caption file uploaded. Adding to video 1_9kdmnhuv</p>
<div class="CaptionsAttached"></div>
<script>
  var element = $('.CaptionsAttached').last();
  element[0].loadData = function() {
    $('.CaptionsAttached').last().load('attachCaptions.php', {
       token: <?php echo json_encode($result->id) ?>,
    });
  }
  element[0].loadData();
</script>
