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
