<?php
  $secret = "YOUR_KALTURA_SECRET";

  $userId = "YOUR_USER_ID";

  $type = KalturaSessionType::USER;

  $partnerId = "YOUR_PARTNER_ID";

  $expiry = 0;

  $privileges = "";

  try {
    $result = $client->session->start(
      $secret, 
      $userId, 
      $type, 
      $partnerId, 
      $expiry, 
      $privileges);
    var_dump($result);
  } catch (Exception $e) {
    echo $e->getMessage();
  }
?>