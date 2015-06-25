require_once('lib/KalturaClient.php');
$config = new KalturaConfiguration(<%- Lucy.variable('answers.partnerId') %>);
$config->serviceUrl = 'http://www.kaltura.com/';
$client = new KalturaClient($config);
$ks = $client->session->start(
  <%- Lucy.variable("answers.adminSecret") %>,
  <%- Lucy.variable("answers.userId") %>,
  KalturaSessionType::ADMIN,
  <%- Lucy.variable('answers.partnerId') %>,
  null, null);
$client->setKS($ks);
