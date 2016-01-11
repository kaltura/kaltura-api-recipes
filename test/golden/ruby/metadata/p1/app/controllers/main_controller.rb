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
