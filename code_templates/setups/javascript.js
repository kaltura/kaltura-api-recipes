<script src="/js/ox.ajast.js"></script>
<script src="/js/webtoolkit.md5.js"></script>
<script src="/js/KalturaClientBase.js"></script>
<script src="/js/KalturaTypes.js"></script>
<script src="/js/KalturaVO.js"></script>
<script src="/js/KalturaServices.js"></script>
<script src="/js/KalturaClient.js"></script>
<script src="/js/vendor/jquery.ui.widget.js"></script>
<script src="/js/jquery.fileupload.js"></script>
<script src="/js/jquery.fileupload-kaltura.js"></script>

<script>
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
