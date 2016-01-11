<?php
  require_once('../../lib/KalturaClient.php');
  require_once('Credentials.php');

  $config = new KalturaConfiguration(PARTNER_ID);
  $config->serviceUrl = "http://jessex";
  $client = new KalturaClient($config);
  $ks = $client->session->start(
    SECRET,
    USER_ID,
    SESSION_TYPE,
    PARTNER_ID,
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
  $result = (object) $template;
?>

<?php if($result->message && $result->code) { ?>
  <h1><?php echo $result->message ?></h1>
<?php } else { ?>
  <h3><?php echo $result->id ?> - <?php echo $result->name ?></h3>
  <p>System Name: <?php echo $result->systemName ?></p>
  <p>Type: <?php echo $result->type ?></p>
  <?php if($result->type == 'httpNotification.Http') { ?>
    <p>URL: <?php echo $result->url ?></p>
  <?php } ?>
  <?php if($result->type == 'emailNotification.Email') { ?>
    <p>Subject: <?php echo $result->subject ?></p>
    <div style="font-size: 12px">
      <?php echo $result->body ?>
    </div>
  <?php } ?>
  <hr></hr>
<?php } ?>
