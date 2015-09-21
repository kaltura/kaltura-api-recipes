<?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1><?php } else { ?>
	    <h2>Metadata Object <?php echo $result->name ?></h2>
	    <p><b>ID:</b> <?php echo $result->id ?></p>
	    <p>XML:
	    <pre>
	    <?php echo htmlspecialchars($result->xml) ?>
	    </pre>
	    </p>
<?php } ?>
