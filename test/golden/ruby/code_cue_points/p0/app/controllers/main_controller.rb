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
    filter.cue_point_type_equal = KalturaCuePointType::CODE;
    filter.entry_id_equal = "1_318vzqcr";

    pager = KalturaFilterPager.new();


    results = @@client.cue_point_service.list(
        filter,
        pager)
    render :template => "main/_code_cue_point_list_response", :locals => {:result => results.objects}
  end

  def addCodeCuePoint
    cuePoint = KalturaCodeCuePoint.new();
    cuePoint.code = params[:code];
    cuePoint.description = params[:description]
    cuePoint.start_time = params[:startTime];
    cuePoint.entry_id = "1_318vzqcr";
    result = @@client.cue_point_service.add(cuePoint);
    render :template => "main/_code_cue_point_added", :locals => {:result => result}
  end

  def getMedia
    entryId = request[:entryId];
    version = nil;

    results = @@client.media_service.(
        entryId,
        version)
    render :template => "main/_kaltura_media_entry", :locals => {:result => results}
  end
end
