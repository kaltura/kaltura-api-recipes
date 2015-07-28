$entry = new KalturaMediaEntry();
$entry->name = <%- Lucy.code.variable('answers.name') %>;
$entry->mediaType = <%- Lucy.code.variable('answers.mediaType') %>;
$entry = $client->media->add($entry);
$mediaResource = new KalturaUploadedFileTokenResource();
$mediaResource->token = <%- Lucy.code.variable('answers.uploadTokenId') %>;

$result = $client->media->addContent($entry->id, $mediaResource);
while ($result->status != 2) {
  sleep(1);
  $result = $client->media->get($result->id);
}
<%- Lucy.returnCode('$result') %>
