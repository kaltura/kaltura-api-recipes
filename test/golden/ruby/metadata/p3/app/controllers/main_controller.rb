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


  def listMetadata
    filter = KalturaMetadataFilter.new();

    pager = KalturaFilterPager.new();


    results = @@client.metadata_service.list(
        filter,
        pager)
    render :template => "main/_kaltura_metadata_list_response", :locals => {:result => results.objects}
  end

  def deleteMetadata
    id = request[:id];

    results = @@client.metadata_service.delete(id)
    render :template => "main/_metadata_deleted", :locals => {:result => results}
  end
end
