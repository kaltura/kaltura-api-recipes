<?php
  require "AddEventNotificationTemplateForm.php";
?>
<script>
  $('#AddEventNotificationTemplateForm').submit(function() {
    var data = new FormData(document.getElementById('AddEventNotificationTemplateForm'));
    $.ajax({
       url: '/cloneEventNotificationTemplate.php',
       type: 'POST',
       data: data,
       contentType: false,
       cache: false,
       processData: false,
       success: function (data, textStatus, jqXHR) {
         $('#CloneStatus').text('Success!');
       }
    }); 
    return false;
  })
</script>