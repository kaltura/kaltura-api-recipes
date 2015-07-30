<?php
require_once('../../lib/KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration($PARTNER_ID);
$config->serviceUrl = "https://www.kaltura.com/";
$client = new KalturaClient($config);
$ks = $client->session->start(
  $SECRET,
  $USER_ID,
  $SESSION_TYPE,
  $PARTNER_ID,
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
require 'KalturaEventNotificationTemplate.php';
?>