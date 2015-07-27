req.body = req.body || {};
var bus = new busboy({headers: req.headers});
var dest = null;
bus.on('file', function(field, file, filename) {
  dest = __dirname + '/' + filename;
  file.pipe(require('fs').createWriteStream(dest));
});
bus.on('field', function(field, value) {
  req.body[field] = value;
});
bus.on('finish', function() {
  var uploadToken = new Kaltura.objects.KalturaUploadToken();
  client.uploadToken.add(function(result) {
    var tokenId = result.id;
    client.uploadToken.upload(function(result) {
      <%- Lucy.returnCode('result', 6) %>
    }, tokenId, dest);
  }, uploadToken)
});
req.pipe(bus);
