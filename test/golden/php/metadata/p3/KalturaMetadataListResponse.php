<?php foreach($result as $index=>$profile) { ?>
  <div class="row">
    <div class="col-xs-8">
      <?php $result = $profile; ?><?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1>
      <?php } else { ?>
        <h2>Metadata Object <?php echo $result->name ?></h2>
        <p><b>Metadata ID:</b> <?php echo $result->id ?></p>
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
