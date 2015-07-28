var entry = new Kaltura.objects.KalturaMediaEntry();
entry.name = <%- Lucy.code.variable('answers.name') %>;
entry.mediaType = <%- Lucy.code.variable('answers.mediaType') %>;
client.media.add(function(entry) {
  var mediaResource = new Kaltura.objects.KalturaUploadedFileTokenResource();
  mediaResource.token = <%- Lucy.code.variable('answers.uploadTokenId') %>;
  var checkStatus = function(entry) {
    if (entry.status === 2) {
      <%- Lucy.returnCode('entry', 4) %>
    } else {
      setTimeout(function() {
        client.media.get(checkStatus, entry.id);
      }, 100);
    }
  }
  client.media.addContent(checkStatus, entry.id, mediaResource);
}, entry);
