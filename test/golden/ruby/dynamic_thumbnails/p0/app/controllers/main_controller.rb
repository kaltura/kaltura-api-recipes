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


  def listMedia
    filter = KalturaMediaEntryFilter.new();

    pager = KalturaFilterPager.new();


    results = @@client.media_service.list_action(
        filter,
        pager)
    render :template => "main/_dynamic_thumbnails", :locals => {:result => results.objects}
  end
end
