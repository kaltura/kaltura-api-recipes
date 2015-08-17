uploadToken = KalturaUploadToken.new();
result = @@client.upload_token_service.add(uploadToken)
result = @@client.uploadToken.upload(result.id, dest)
var captionResource = KalturaUploadedFileTokenResource.new();
captionResource.token = result.id;
captionAsset = KalturaCaptionAsset.new();
captionAsset.format = KalturaCaptionType::SRT;
captionAsset.is_default = true;
captionAsset.language = KalturaLanguage::EN;
captionAsset.label = 'English';
newAsset = @@client.caption_asset_service.add(<%- Lucy.code.variable('answers.entryId') %>, captionAsset)
result = @@client.caption_asset_service.set_content(newAsset.id, captionResource)
<%- Lucy.returnCode('result') %>
