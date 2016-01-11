require "net/http"

class MainController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'kaltura'
  include Kaltura

  config = KalturaConfiguration.new(102)
  config.service_url = "http://jessex"
  @@client = KalturaClient.new(config);
  @@client.ks = @@client.session_service.start(
      "e472b44321fe63f669d825479b21cdb2",
      "lucybot@example.com",
      KalturaSessionType::USER,
      102)


  def CreateMediaEntry
    entry = Kaltura::KalturaMediaEntry.new
    entry.name = request[:name]
    entry.media_type = 1
    token = request[:upload_token_id]
    entry = @@client.media_service.add_from_uploaded_file(entry, token)

    while entry.status != "2" do
      sleep 1
      entry = @@client.media_service.get(entry.id)
    end
    render :template => "main/_kaltura_media_entry", :locals => {:result => entry}
  end

  def UploadFile
    name = params[:fileData].original_filename
    directory = "/tmp/"
    path = File.join(directory, name)
    File.open(path, "wb") { |f| f.write(params[:fileData].read) }
    video_file=File.open(path)
    uploadToken = KalturaUploadToken.new
    result = @@client.upload_token_service.add(uploadToken)
    token = result.id
    result = @@client.upload_token_service.upload(token,video_file,nil,nil,nil)
    render :template => "main/_upload_done", :locals => {:result => result}
  end
end
