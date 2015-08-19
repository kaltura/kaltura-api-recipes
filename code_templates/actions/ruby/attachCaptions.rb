path = File.join(Dir.pwd, "public", params[:fileData].original_filename)
File.open(path, "wb") { |f| f.write(params[:fileData].read) }
file = File.open(path)
uploadToken = KalturaUploadToken.new();
result = @@client.upload_token_service.add(uploadToken)
result = @@client.upload_token_service.upload(result.id, file)
captionResource = KalturaUploadedFileTokenResource.new();
captionResource.token = result.id;
captionAsset = KalturaCaptionAsset.new();
captionAsset.format = KalturaCaptionType::SRT;
captionAsset.is_default = 1;
captionAsset.language = KalturaLanguage::EN;
captionAsset.label = 'English';
newAsset = @@client.caption_asset_service.add(<%- Lucy.code.variable('answers.entryId') %>, captionAsset)
result = @@client.caption_asset_service.set_content(newAsset.id, captionResource)
<%- Lucy.returnCode('result') %>
