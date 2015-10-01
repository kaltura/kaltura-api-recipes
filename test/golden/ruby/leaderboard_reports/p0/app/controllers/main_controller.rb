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


  def getTableReport
    reportInputFilter = KalturaReportInputFilter.new();
    reportInputFilter.from_day = "20150615";
    reportInputFilter.to_day = "20150715";

    pager = KalturaFilterPager.new();

    reportType = KalturaReportType::USER_TOP_CONTENT;
    order = "count_plays";
    objectIds = nil;

    results = @@client.report_service.get_table(
        reportType,
        reportInputFilter,
        pager,
        order,
        objectIds)
    render :template => "main/_kaltura_report_table", :locals => {:result => results}
  end
end
