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
template = @@client.event_notification_template_service.clone(<%- Lucy.code.variable('answers.id') %>, template)
template = @@client.eventNotificationTemplate.updateStatus(
  template.id,
  KalturaEventNotificationTemplateStatus::ACTIVE)
<%- Lucy.returnCode('template', 4) %> 
