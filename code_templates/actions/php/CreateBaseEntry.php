$entry = new KalturaBaseEntry();
$entry->name = <%- Lucy.code.variable('answers.name') %>;
$uploadTokenId = <%- Lucy.code.variable('answers.uploadTokenId') %>;

$result = $client->baseEntry->addFromUploadedFile($entry, $uploadTokenId);
while ($result->status != 2) {
  sleep(.1);
  $result = $client->media->get($result->id);
}
<%- Lucy.returnCode('$result') %>
