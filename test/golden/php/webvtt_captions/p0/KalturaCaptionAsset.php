<div id="ErrorMessage" class="alert alert-danger" style="display: none">
</div>
<?php if($result->message && $result->code) { ?>
    <h1><?php echo $result->message ?></h1><?php } else { ?>
		  <h1>Caption Asset info:</h1>
		  <p>Caption Asset ID: <?php echo $result->id ?></p>
		  <p>Language: <?php echo $result->language ?></p>
		  <p>Size: <?php echo $result->size ?></p>
<?php } ?>
