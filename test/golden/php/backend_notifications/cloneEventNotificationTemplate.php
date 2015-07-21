<?php
require_once('lib/KalturaClient.php');
$config = new KalturaConfiguration(1760921);
$config->serviceUrl = 'https://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  "8d6cb692ab0f41bfa6bde373204c4b40",
  "lucybot@example.com",
  KalturaSessionType::ADMIN,
  1760921,
  null, null);
$client->setKS($ks);

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
$template = $client->eventNotificationTemplate->cloneAction(null, template);
$template = $client.eventNotificationTemplate.updateStatus($template.id, KalturaEventNotificationTemplateStatus::ACTIVE);
$result = (object)$template;
include 'KalturaEventNotificationTemplate.php';
?>