<?php
  $PARTNER_ID = <%- Lucy.code.variable('answers.partnerId') %>;
  $SECRET = <%- Lucy.code.variable('answers.secret') %>;
  $USER_ID = <%- Lucy.code.variable('answers.userId') %>;
  $SESSION_TYPE = <%- Lucy.answer('sessionType') === 0 ? 'KalturaSessionType::USER' : 'KalturaSessionType::ADMIN' %>;
?>
