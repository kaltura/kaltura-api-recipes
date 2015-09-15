<?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1>
<?php } ?>
<h2>Metadata Object <?php echo $result->name ?></h2>
<p><b>System Name:</b> <?php echo $result->systemName ?></p>
<p>XSD: <?php echo ${ result->xsd ?>}</p>
