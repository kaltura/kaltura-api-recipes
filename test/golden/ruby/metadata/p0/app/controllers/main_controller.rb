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


  def addMetadataProfile
    metadataProfile = KalturaMetadataProfile.new();
    metadataProfile.metadata_object_type = KalturaMetadataObjectType::ENTRY;
    metadataProfile.create_mode = KalturaMetadataProfileCreateMode::API;

    xsdData = "<xsd:schema></xsd:schema>";
    viewsData = nil;

    results = @@client.metadata_profile_service.add(
        metadataProfile,
        xsdData,
        viewsData)
    render :template => "main/metadata_profile_show", :locals => {:result => results}
  end
end
