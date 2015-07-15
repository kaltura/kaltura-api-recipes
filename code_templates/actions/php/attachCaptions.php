move_uploaded_file($_FILES["fileData"]["tmp_name"], $_FILES["fileData"]["name"]);
$uploadToken = new KalturaUploadToken();
$result = $client->uploadToken->add($uploadToken);
$tok=$result->id;
$resume = null;
$finalChunk = null;
$resumeAt = null;
$result = $client->uploadToken->upload($tok, $_FILES["fileData"]["name"], $resume, $finalChunk, $resumeAt);

$captionResource = new KalturaUploadedFileTokenResource();
$captionResource->token = $result->id;
$captionAsset = new KalturaCaptionAsset();
$captionAsset->format = KalturaCaptionType::SRT;
$captionAsset->isDefault = true;
$captionAsset->language = KalturaLanguage::EN;
$captionAsset->label = 'English';
$newAsset = $client->captionAsset->add(<%- Lucy.code.variable('answers.entryId') %>, $captionAsset);
$client->captionAsset->setContent($newAsset->id, $captionResource);
<%- Lucy.returnCode("$result") %>
