<h1>Search Results for "support"</h1>
<hr></hr>
<?php foreach($result as $index=>$caption) { ?>
  <div class="row">
    <div class="col-xs-4 text-right">
      <img src="<?php echo $caption->entry->thumbnailUrl ?>"></img>
    </div>
    <div class="col-xs-7 col-xs-offset-1">
      <p><i><?php echo $caption->content ?></i></p>
    </div>
  </div>
  <hr></hr>
<?php } ?>