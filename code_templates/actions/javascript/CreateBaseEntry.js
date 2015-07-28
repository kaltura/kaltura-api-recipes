entry = new KalturaMediaEntry();
entry.name = <%- Lucy.code.variable('answers.name') %>;
var uploadTokenId = <%- Lucy.code.variable('answers.uploadTokenId') %>;

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
    }, 100);
  } else {
    $('#UploadStatusBar').hide();
    $('#UploadSuccess').show();
    <%- Lucy.returnCode('results') %>
  }
}
client.baseEntry.addFromUploadedFile(checkStatus, entry, uploadTokenId);
