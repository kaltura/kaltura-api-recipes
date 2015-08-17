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


  def listCuePoint
    filter = KalturaCuePointFilter.new();
    filter.entry_id_equal = "1_318vzqcr";

    pager = KalturaFilterPager.new();


    results = @@client.cue_point_service.list_action(
        filter,
        pager)
    render :template => "main/_kaltura_cue_point_list_response", :locals => {:result => results.objects}
  end

  def getMedia
    entryId = request[:entryId];
    version = nil;

    results = @@client.media_service.get(
        entryId,
        version)
    render :template => "main/_kaltura_media_entry", :locals => {:result => results}
  end
end
