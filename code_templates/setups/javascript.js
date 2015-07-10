<script type="text/javascript" src="/js/ox.ajast.js"></script>
<script type="text/javascript" src="/js/webtoolkit.md5.js"></script>
<script type="text/javascript" src="/js/KalturaClientBase.js"></script>
<script type="text/javascript" src="/js/KalturaTypes.js"></script>
<script type="text/javascript" src="/js/KalturaVO.js"></script>
<script type="text/javascript" src="/js/KalturaServices.js"></script>
<script type="text/javascript" src="/js/KalturaClient.js"></script>
<script type="text/javascript">
  var config = new KalturaConfiguration(<%- Lucy.answer('partnerId') %>);
  config.serviceUrl = "http://www.kaltura.com/";
  var client = new KalturaClient(config);
  client.session.start(function(success, ks) {
    client.setKs(ks);
  }, <%- Lucy.variable("answers.adminSecret") %>,
  <%- Lucy.variable("answers.userId") %>,
  KalturaSessionType.ADMIN,
  <%- Lucy.variable('answers.partnerId') %>)
</script>
