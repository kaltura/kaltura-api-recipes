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

    results = @@client.media_service.get(
        entryId,
        version)
    render :template => "main/_kaltura_media_entry", :locals => {:result => results}
  end
end
