<?php
  require_once('../../lib/KalturaClient.php');
  require_once('Credentials.php');

  $config = new KalturaConfiguration(PARTNER_ID);
  $config->serviceUrl = "https://www.kaltura.com/";
  $client = new KalturaClient($config);
  $ks = $client->session->start(
    SECRET,
    USER_ID,
    SESSION_TYPE,
    PARTNER_ID,
    null, null);
  $client->setKS($ks);

  $filter = new KalturaMediaEntryFilter();
  $filter->totalRankGreaterThanOrEqual = 1;
  $filter->orderBy = "-rank";

  $pager = new KalturaFilterPager();


  try {
    $result = $client->media->listAction(
      $filter, 
      $pager);
    $result = (object) $result->objects;
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>

<table class="table">
  <tr>
    <td></td>
    <td>Name</td>
    <td>Rank</td>
    <td>Votes</td>
  </tr>
  
  <?php foreach($result as $index=>$video) { ?>
    <tr>
      <td><?php echo $index + 1 ?></td>
      <td><?php echo $video->name ?></td>
      <td><?php echo $video->rank ?></td>
      <td><?php echo $video->votes ?></td>
    </tr>
  <?php } ?></table>
