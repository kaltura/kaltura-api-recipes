<p>Caption file uploaded. Adding to video "1_318vzqcr"</p>
<div class="CaptionsAttached"></div>
<script>
  var element = $('.CaptionsAttached').last();
  element[0].loadData = function() {
    $('.CaptionsAttached').last().load('attachCaptions.php', {
       token: $result->id,
    });
  }
  element[0].loadData();
</script>