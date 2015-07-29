<h1>Clone Template</h1>
<hr></hr>
<?php foreach($result as $index=>$template) { ?>
  <?php if($template->id == null) { ?>
    <?php
  $result = $template;
  require "KalturaEventNotificationTemplate.php";
?>
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