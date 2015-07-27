var entry = new Kaltura.objects.KalturaBaseEntry();
entry.name = <%- Lucy.code.variable('answers.name') %>;
var uploadTokenId = <%- Lucy.code.variable('answers.uploadTokenId') %>;
var checkStatus = function(entry) {
  if (entry.status === 2) {
    <%- Lucy.returnCode('entry', 4) %>
  } else {
    setTimeout(function() {
      client.media.get(checkStatus, entry.id);
    }, 100);
  }
}
client.baseEntry.addFromUploadedFile(checkStatus, entry, uploadTokenId);
