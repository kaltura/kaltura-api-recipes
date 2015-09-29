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
