<p>Cue point added. Loading video...</p>
<div class="KalturaMediaEntry"></div>
<script>
  var element = $('.KalturaMediaEntry').last();
  element[0].loadData = function() {
    $('.KalturaMediaEntry').last().load('getMedia.php', {
       entryId: null,
    });
  }
  element[0].loadData();
</script>
<script>
</script>