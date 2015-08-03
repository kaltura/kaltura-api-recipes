<?php
  Define("PARTNER_ID", <%- Lucy.code.variable('answers.partnerId') %>);
  Define("SECRET", <%- Lucy.code.variable('answers.secret') %>);
  Define("USER_ID", <%- Lucy.code.variable('answers.userId') %>);
  Define("SESSION_TYPE", <%- Lucy.answer('sessionType') === 0 ? 'KalturaSessionType::USER' : 'KalturaSessionType::ADMIN' %>);
?>
