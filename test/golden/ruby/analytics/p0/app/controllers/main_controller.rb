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


  def getTotalReport
    reportInputFilter = KalturaReportInputFilter.new();
    reportInputFilter.from_day = "2015-07-01";
    reportInputFilter.to_day = "2015-07-10";

    reportType = KalturaReportType::TOP_CONTRIBUTORS;
    objectIds = nil;

    results = @@client.report_service.get_total(
        reportType,
        reportInputFilter,
        objectIds)
    render :template => "main/_kaltura_report_total", :locals => {:result => results}
  end
end
