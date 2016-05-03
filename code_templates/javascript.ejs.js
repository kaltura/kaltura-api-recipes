<% if (showSetup) { -%>
<script src="/js/kaltura/ox.ajast.js"></script>
<script src="/js/kaltura/webtoolkit.md5.js"></script>
<script src="/js/kaltura/KalturaClientBase.js"></script>
<script src="/js/kaltura/KalturaTypes.js"></script>
<script src="/js/kaltura/KalturaVO.js"></script>
<script src="/js/kaltura/KalturaServices.js"></script>
<script src="/js/kaltura/KalturaClient.js"></script>

<script>
  var config = new KalturaConfiguration(<%- answers.partnerId %>);
<% if (answers.serviceURL) { -%>
  config.serviceUrl = <%- Lucy.code.variable('answers.serviceURL') %>;
<% } -%>
  var client = new KalturaClient(config);
  client.session.start(function(success, ks) {
    if (!success || (ks.code && ks.message)) {
      console.log('Error starting session', success, ks);
      $('#ErrorMessage').text(ks.message || 'Unknown Error').show();
    } else {
      window.ks = ks;
      client.setKs(ks);
    }
    // Note: this is meant only as a sample.
    // You should NEVER generate sessions on the client,
    // as this exposes your Admin Secret to users.
    // Instead, generate a session on the server and pass the
    // KS to the client.
  }, <%- helper.getValue(answers.secret) %>,
  <%- helper.getValue(answers.userId) %>,
  <%- answers.sessionType === 0 ? 'KalturaSessionType.USER' : 'KalturaSessionType.ADMIN' %>,
  <%- helper.getValue(answers.partnerId) %>)
</script>
<script>
<% } -%>
<%  parameters.forEach(function(param) { -%>
<%  var setter = helper.getFieldSetter(param, [], answers); -%>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>
<%  }) -%>
client.<%- service %>.<%- action %>(function(success, results) {
  if (!success || (results && results.code && results.message)) {
    console.log('Kaltura Error', success, results);
  } else {
    console.log('Kaltura Result', results);
  }
}<%- parameters.length === 0 ? ');' : ',' %>
<% parameters.forEach(function(param, index) { -%>
<%- param.name %><%- index < parameters.length - 1 ? ',' : ');' %>
<% }); -%>
<%- showSetup ? '</script>' : '' %>
