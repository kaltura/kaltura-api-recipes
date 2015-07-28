var captionResource = new KalturaUploadedFileTokenResource();
captionResource.token = <%- Lucy.code.variable('answers.token') %>;
var captionAsset = new KalturaCaptionAsset();
captionAsset.format = KalturaCaptionType.SRT;
captionAsset.isDefault = true;
captionAsset.language = KalturaLanguage.EN;
captionAsset.label = 'English';
client.captionAsset.add(function(success, newAsset) {
  client.captionAsset.setContent(function(success, response) {
    <%- Lucy.returnCode('response') %>
  }, newAsset.id, captionResource);
}, <%- Lucy.code.variable('answers.entryId') %>, captionAsset);

