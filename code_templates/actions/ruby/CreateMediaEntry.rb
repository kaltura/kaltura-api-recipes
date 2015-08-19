entry = Kaltura::KalturaMediaEntry.new
entry.name = <%- Lucy.code.variable('answers.name') %>
entry.media_type = <%- Lucy.code.variable('answers.mediaType') %>
token = <%- Lucy.code.variable('answers.upload_token_id') %>
entry = @@client.media_service.add_from_uploaded_file(entry, token)

while entry.status != "2" do
  sleep 1
  entry = @@client.media_service.get(entry.id)
end
<%- Lucy.returnCode('entry') %>
