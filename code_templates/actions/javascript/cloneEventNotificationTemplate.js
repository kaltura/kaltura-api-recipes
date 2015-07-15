var template;
if ($('input[name="email"]').length) {
  template = new KalturaEmailNotificationTemplate();
  var recipient = new KalturaEmailNotificationRecipient();
  recipient.email = $('input[name="email"]').val();
  template.to = new KalturaEmailNotificationStaticRecipientProvider();
  template.to.emailRecipients = [recipient];
} else {
  template = new KalturaHttpNotificationTemplate();
  template.url = $('input[name="url"]').val();
}
template.name = $('input[name="name"]').val();
client.eventNotificationTemplate.cloneAction(function(success, template) {
  if (!success || (template.code && template.message))
      return $('#CloneStatus').text(template.message || 'Unknown Error')
  client.eventNotificationTemplate.updateStatus(function(success, template) {
    if (!success || (template.code && template.message))
        return $('#CloneStatus').text(template.message || 'Unknown Error');
    $('#CloneStatus').text('Success!');
  }, template.id, KalturaEventNotificationTemplateStatus.ACTIVE);
}, <%- Lucy.code.variable('answers.id') %>, template);
