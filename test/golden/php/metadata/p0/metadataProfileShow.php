<?php if($result->message && $result->code) { ?>
  <h1><?php echo $result->message ?></h1>
<?php } else { ?>
  <h2>Metadata Profile Object <?php echo $result->name ?></h2>
  <p><b>System Name:</b> <?php echo $result->systemName ?></p>
  <p>XSD:
    <pre>
	    <?php echo htmlspecialchars($result->xsd) ?>
	    </pre>
  </p>
<?php } ?>
