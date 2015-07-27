var template = null;
if (req.body.email) {
  template = new Kaltura.objects.KalturaEmailNotificationTemplate();
  var recipient = new KalturaEmailNotificationRecipient();
  recipient.email = req.body.email;
  template.to = new KalturaEmailNotificationStaticRecipientProvider();
  template.to.emailRecipients = [recipient];
} else {
  template = new KalturaHttpNotificationTemplate();
  template.url = req.body.url;
}
template.name = req.body.name;
template = client.eventNotificationTemplate.cloneAction(function(template) {
  client.eventNotificationTemplate.updateStatus(function(template) {
    <%- Lucy.returnCode('template', 4) %> 
  },
  template.id,
  Kaltura.enums.KalturaEventNotificationTemplateStatus.ACTIVE);
}, <%- Lucy.code.variable('answers.id') %>, template);
