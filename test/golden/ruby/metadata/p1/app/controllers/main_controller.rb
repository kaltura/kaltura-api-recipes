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


  def addMetadata
    metadataProfileId = nil;
    objectType = KalturaMetadataObjectType::ENTRY;
    objectId = nil;
    xmlData = "<metadata><Somefield>LINUX RULES</Somefield></metadata>";

    results = @@client.metadata_service.add(
        metadataProfileId,
        objectType,
        objectId,
        xmlData)
    render :template => "main/_metadata_show", :locals => {:result => results}
  end
end
