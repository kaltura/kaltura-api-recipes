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


  def HandleHTTPNotifications
    puts 'Kaltura Notification:' + params
  end

  def listTemplatesEventNotificationTemplate
    filter = KalturaEventNotificationTemplateFilter.new();

    pager = KalturaFilterPager.new();


    results = @@client.event_notification_template_service.list_templates(
        filter,
        pager)
    render :template => "main/_kaltura_event_notification_template_list_response", :locals => {:result => results.objects}
  end

  def cloneEventNotificationTemplate
    template = null
    if params[:email] then
      template = KalturaEmailNotificationTemplate.new()
      recipient = KalturaEmailNotificationRecipient.new()
      recipient.email = params[:email]
      template.to = KalturaEmailNotificationStaticRecipientProvider.new()
      template.to.email_recipients = [recipient]
    else
      template = KalturaHttpNotificationTemplate.new()
      template.url = params[:url]
    end
    template.name = params[:name]
    template = @@client.event_notification_template_service.clone(nil, template)
    template = @@client.eventNotificationTemplate.updateStatus(
      template.id,
      KalturaEventNotificationTemplateStatus::ACTIVE)
        render :template => "main/_kaltura_event_notification_template", :locals => {:result => template}
  end

  def listEventNotificationTemplate
    filter = KalturaEventNotificationTemplateFilter.new();

    pager = KalturaFilterPager.new();


    results = @@client.event_notification_template_service.list(
        filter,
        pager)
    render :template => "main/_kaltura_event_notification_template_list_response", :locals => {:result => results.objects}
  end

  def listPermission
    filter = KalturaPermissionFilter.new();
    filter.name_equal = "EVENTNOTIFICATION_PLUGIN_PERMISSION";

    pager = KalturaFilterPager.new();


    results = @@client.permission_service.list(
        filter,
        pager)
    render :template => "main/_kaltura_permission_list_response", :locals => {:result => results.objects}
  end
end
