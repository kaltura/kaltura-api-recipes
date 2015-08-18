entry = KalturaMediaEntry.new()
entry.name = <%- Lucy.code.variable('answers.name') %>
entry.media_type = <%- Lucy.code.variable('answers.mediaType') %>
entry = @@client.media_service.add(entry)
mediaResource = KalturaUploadedFileTokenResource.new()
mediaResource.token = <%- Lucy.code.variable('answers.uploadTokenId') %>
entry = @@client.media_service.add_content(entry.id, mediaResource)
while entry.status != 2 do
  sleep 1
  entry = @@client.media.get()
end
<%- Lucy.returnCode('entry') %>
