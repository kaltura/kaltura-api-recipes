<script>
  $(document).ready(function() {
    $('#UploadForm').submit(function() {
      var data = new FormData(document.getElementById('UploadForm'));
       $.ajax({
         url: '/UploadFile.php',
         type: 'POST',
         data: data,
         mimeType: "multipart/form-data",
         contentType: false,
         cache: false,
         processData: false,
         success: function (data, textStatus, jqXHR) {
           $('#UploadDone').html(data);
         }
       });
      return false;
    })
  });
</script>

<h1>Upload Video</h1>
<label>Video to Upload</label>
<form id="UploadForm">
  <input type="file" name="fileData"></input>
  <input type="submit" value="Upload"></input>
</form>
<div id="UploadDone"></div>
