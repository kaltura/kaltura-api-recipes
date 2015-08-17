path = File.join(Dir.pwd, "public", params[:fileData].original_filename)
File.open(path, "wb") { |f| f.write(params[:fileData].read) }
uploadToken = KalturaUploadToken.new();
result = @@client.upload_token_service.add(uploadToken)
result = @@client.upload_token_service.upload(result.id, path)
<%- Lucy.returnCode('result') %>
