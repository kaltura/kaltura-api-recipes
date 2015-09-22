<h1>Clone Template</h1>
<hr></hr>
<?php foreach($result as $index=>$template) { ?>
  <?php if($template->id == null) { ?>
    <?php $result = $template; ?><?php if($result->message && $result->code) { ?>
        <h1><?php echo $result->message ?></h1><?php } else { ?>
		<h3><?php echo $result->id ?> - <?php echo $result->name ?></h3>
		<p>System Name: <?php echo $result->systemName ?></p>
		<p>Type: <?php echo $result->type ?></p>
		<?php if($result->type == 'httpNotification.Http') { ?>
		  <p>URL: <?php echo $result->url ?></p>
		<?php } ?>
		<?php if($result->type == 'emailNotification.Email') { ?>
		  <p>Subject: <?php echo $result->subject ?></p>
		  <div style="font-size: 12px">
		    <?php echo $result->body ?>
		  </div>
		<?php } ?>
		<hr></hr>
<?php } ?>


    <form id="AddEventNotificationTemplateForm">
      <div class="form-group">
        <label>Template Name</label>
        <input class="form-control" type="text" name="name"></input>
      </div>
      <div class="form-group">
        <?php if($template->type == 'emailNotification.Email') { ?>
          <label>E-mail Address</label>
          <input class="form-control" type="text" name="email"></input>
        <?php } ?>
        <?php if($template->type == 'httpNotification.Http') { ?>
          <label>URL</label>
          <input class="form-control" type="text" name="url"></input>
        <?php } ?>
      </div>
      <div class="form-group">
        <input class="btn btn-success" type="submit" value="Create Notification"></input>
      </div>
    </form>
    <div class="alert alert-info" id="CloneStatus" style="display: none"></div>
  <?php } ?>
<?php } ?>
