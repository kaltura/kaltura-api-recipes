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
      var captionResource = new Kaltura.objects.KalturaUploadedFileTokenResource();
      captionResource.token = result.id;
      captionAsset = new Kaltura.objects.KalturaCaptionAsset();
      captionAsset.format = Kaltura.enums.KalturaCaptionType.SRT;
      captionAsset.isDefault = true;
      captionAsset.language = Kaltura.enums.KalturaLanguage.EN;
      captionAsset.label = 'English';
      client.captionAsset.add(function(newAsset) {
        client.captionAsset.setContent(function(result) {
          <%- Lucy.returnCode('result', 10) %>
        }, newAsset.id, captionResource);
      }, <%- Lucy.code.variable('answers.entryId') %>, captionAsset)
    }, tokenId, dest);
  }, uploadToken)
})
req.pipe(bus);
