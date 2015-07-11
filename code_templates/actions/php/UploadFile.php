move_uploaded_file($_FILES["fileData"]["tmp_name"], $_FILES["fileData"]["name"]);
$uploadToken = new KalturaUploadToken();
$result = $client->uploadToken->add($uploadToken);
$tok=$result->id;
$resume = null;
$finalChunk = null;
$resumeAt = null;
$result = $client->uploadToken->upload($tok, $_FILES["fileData"]["name"], $resume, $finalChunk, $resumeAt);
<%- Lucy.returnCode("$result") %>
