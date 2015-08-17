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
