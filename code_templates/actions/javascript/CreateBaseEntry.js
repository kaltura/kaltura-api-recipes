entry = new KalturaMediaEntry();
entry.name = <%- Lucy.code.variable('answers.name') %>;
entry.type = KalturaEntryType.AUTOMATIC;
client.media.add(function(success, entry) {
  if (!success || (entry.code && entry.message)) {
    return console.log('Kaltura Error', success, entry);
  }
  var mediaResource = new KalturaUploadedFileTokenResource();
  mediaResource.token = <%- Lucy.code.variable('answers.uploadTokenId') %>;
  var checkStatus = function(success, results) {
    if (!success || (results.code && results.message)) {
      console.log('Kaltura Error', success, results);
    } else if (results.status !== 2) {
      var statusMessage = results.status === 1 ?
          'converting' : 'status ' + results.status;
      $('#UploadStatus').text(
          'Entry not ready yet (' + statusMessage + ')');
      setTimeout(function() {
        client.media.get(checkStatus, results.id);
      }, 1000);
    } else {
      $('#UploadStatusBar').hide();
      $('#UploadSuccess').show();
      <%- Lucy.returnCode('results') %>
    }
  }
  client.media.addContent(checkStatus, entry.id, mediaResource);
}, entry);

