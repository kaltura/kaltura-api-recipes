<?php
  $entryId = "abcde";

  $version = "";

  try {
    $result = $client->media->get(
      $entryId, 
      $version);
    var_dump($result);
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>
