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
