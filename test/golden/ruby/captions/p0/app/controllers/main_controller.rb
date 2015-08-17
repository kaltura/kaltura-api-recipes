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


  def getMedia
    entryId = "1_9kdmnhuv";
    version = nil;

    results = @@client.media_service.get(
        entryId,
        version)
    render :template => "main/_kaltura_media_entry", :locals => {:result => results}
  end

  def searchCaptionAssetItem
    entryFilter = KalturaBaseEntryFilter.new();

    captionAssetItemFilter = KalturaCaptionAssetItemFilter.new();
    captionAssetItemFilter.content_like = "support";

    captionAssetItemPager = KalturaFilterPager.new();


    results = @@client.caption_asset_item_service.search(
        entryFilter,
        captionAssetItemFilter,
        captionAssetItemPager)
    render :template => "main/_caption_search", :locals => {:result => results.objects}
  end

  def attachCaptions
    path = File.join(Dir.pwd, "public", params[:fileData].original_filename)
    File.open(path, "wb") { |f| f.write(params[:fileData].read) }
    uploadToken = KalturaUploadToken.new();
    result = @@client.upload_token_service.add(uploadToken)
    result = @@client.upload_token_service.upload(result.id, path)
    var captionResource = KalturaUploadedFileTokenResource.new();
    captionResource.token = result.id;
    captionAsset = KalturaCaptionAsset.new();
    captionAsset.format = KalturaCaptionType::SRT;
    captionAsset.is_default = true;
    captionAsset.language = KalturaLanguage::EN;
    captionAsset.label = 'English';
    newAsset = @@client.caption_asset_service.add("1_9kdmnhuv", captionAsset)
    result = @@client.caption_asset_service.set_content(newAsset.id, captionResource)
    render :template => "main/_captions_attached", :locals => {:result => result}
  end
end
