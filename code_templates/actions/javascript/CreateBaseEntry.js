entry = new KalturaBaseEntry();
entry.name = <%- Lucy.code.variable('answers.name') %>;
var uploadTokenId = <%- Lucy.code.variable('answers.uploadTokenId') %>;

var checkStatus = function(success, results) {
  if (!success || (results.code && results.message)) {
    console.log('Kaltura Error', success, results);
  } else if (results.status !== 2) {
    console.log('Entry not ready yet (status ' + results.status + ')');
    setTimeout(function() {
      client.media.get(checkStatus, results.id);
    }, 100);
  } else {
    <%- Lucy.returnCode('results') %>
  }
}
client.baseEntry.addFromUploadedFile(checkStatus, entry, uploadTokenId);
