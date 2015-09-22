<?php foreach($result as $index=>$profile) { ?>
  <div class="row">
    <div class="col-xs-8">
      <?php $result = $profile; ?><?php if($result->message && $result->code) { ?>
              <h1><?php echo $result->message ?></h1><?php } else { ?>
      	    <h2>Metadata Profile Object <?php echo $result->name ?></h2>
      	    <p><b>System Name:</b> <?php echo $result->systemName ?></p>
      	    <p>XSD:
      	    <pre>
      	    <?php echo htmlspecialchars($result->xsd) ?>
      	    </pre>
      	    </p>
      <?php } ?>

    </div>
    <div class="col-xs-4 text-center">
      <h2>
        <a class="btn btn-danger"
         data-action="deleteMetadataProfile"
         data-view="metadataProfileDeletedView"
         data-answers="{id: <?php echo $profile->id ?>}">
         Delete
      </a>

      </h2>
    </div>
  </div>
<?php } ?>
