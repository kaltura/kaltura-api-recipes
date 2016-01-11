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

  $filter = new KalturaMetadataFilter();

  $pager = new KalturaFilterPager();


  try {
    $result = $client->metadata->listAction(
      $filter, 
      $pager);
    $result = (object) $result->objects;
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>

<?php foreach($result as $index=>$profile) { ?>
  <div class="row">
    <div class="col-xs-8">
      <?php $result = $profile; ?><?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1>
      <?php } else { ?>
        <h2>Metadata Object <?php echo $result->name ?></h2>
        <p>
          <b>Metadata ID:</b> <?php echo $result->id ?></p>
        <p>XML:
          <pre>
            <?php echo htmlspecialchars($result->xml) ?>
          </pre>
        </p>
      <?php } ?>
    </div>
    <div class="col-xs-4 text-center">
      <h2>
        <a class="btn btn-danger"
         data-action="deleteMetadata"
         data-view="metadataDeletedView"
         data-answers="{id: <?php echo $profile->id ?>}">
         Delete
      </a>

      </h2>
    </div>
  </div>
<?php } ?>
