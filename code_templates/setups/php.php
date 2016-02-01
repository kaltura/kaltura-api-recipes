require_once('<%- Lucy.answer('libraryDirectory') || 'lib/' %>KalturaClient.php');
require_once('Credentials.php');

$config = new KalturaConfiguration(PARTNER_ID);
$config->serviceUrl = <%- Lucy.code.variable('answers.serviceURL') %>;
$client = new KalturaClient($config);
$ks = $client->session->start(
  SECRET,
  USER_ID,
  SESSION_TYPE,
  PARTNER_ID,
  null, null);
$client->setKS($ks);

echo "<script>window.ks = '" . $ks . "'</script>";
