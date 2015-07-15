$template = NULL;
if (isset($_POST["email"])) {
  template = new KalturaEmailNotificationTemplate();
  $recipient = new KalturaEmailNotificationRecipient();
  $recipient->email = $_POST["email"];
  $template->to = new KalturaEmailNotificationStaticRecipientProvider();
  template->to->emailRecipients = array();
  template->to->emailRecipients[0] = $recipient;
} else {
  $template = new KalturaHttpNotificationTemplate();
  $template->url = $_POST["url"];
}
template->name = $_POST["name"];
$template = $client->eventNotificationTemplate->cloneAction(<%- Lucy.code.variable('answers.id') %>, template);
$template = $client.eventNotificationTemplate.updateStatus($template.id, KalturaEventNotificationTemplateStatus::ACTIVE);
<%- Lucy.returnCode('$template') %>
