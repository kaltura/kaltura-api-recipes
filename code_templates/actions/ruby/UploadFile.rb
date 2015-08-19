name = params[:fileData].original_filename
directory = "/tmp/"
path = File.join(directory, name)
File.open(path, "wb") { |f| f.write(params[:fileData].read) }
video_file=File.open(path)
uploadToken = KalturaUploadToken.new
result = @@client.upload_token_service.add(uploadToken)
token = result.id
result = @@client.upload_token_service.upload(token,video_file,nil,nil,nil)
<%- Lucy.returnCode('result') %>
