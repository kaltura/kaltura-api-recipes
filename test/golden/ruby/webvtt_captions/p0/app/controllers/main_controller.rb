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


  def listCaptionAsset
    filter = KalturaAssetFilter.new();

    pager = KalturaFilterPager.new();


    results = @@client.caption_asset_service.list(
        filter,
        pager)
    render :template => "main/_kaltura_caption_asset_list_response", :locals => {:result => results.objects}
  end

  def getCaptionAsset
    captionAssetId = nil;

    results = @@client.caption_asset_service.get(captionAssetId)
    render :template => "main/_kaltura_caption_asset", :locals => {:result => results}
  end
end
