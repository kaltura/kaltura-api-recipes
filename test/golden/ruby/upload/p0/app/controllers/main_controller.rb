require "net/http"

class MainController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'kaltura'
  include Kaltura

  config = KalturaConfiguration.new(1760921)
  config.service_url = "https://www.kaltura.com/"
  @@client = KalturaClient.new(config);
  @@client.ks = @@client.session_service.start(
      "8d6cb692ab0f41bfa6bde373204c4b40",
      "lucybot@example.com",
      KalturaSessionType::ADMIN,
      1760921)


  def CreateMediaEntry
    entry = KalturaMediaEntry.new()
    entry.name = request[:name]
    entry.media_type = 1
    entry = @@client.media.add(entry)
    mediaResource = KalturaUploadedFileTokenResource.new()
    mediaResource.token = request[:uploadTokenId]
    entry = @@client.media_service.add_content(entry.id, mediaResource)
    while entry.status != 2 do
      sleep 1
      entry = @@client.media.get()
    end
    render :template => "main/_created_entry", :locals => {:result => entry}
  end

  def UploadFile
    path = File.join(Dir.pwd, "public", params[:fileData].original_filename)
    File.open(path, "wb") { |f| f.write(params[:fileData].read) }
    uploadToken = KalturaUploadToken.new();
    result = @@client.upload_token_service.add(uploadToken)
    result = @@client.upload_token_service.upload(result.id, path)
    render :template => "main/_upload_done", :locals => {:result => result}
  end
end
