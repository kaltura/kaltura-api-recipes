<script type="text/javascript" src="/js/ox.ajast.js"></script>
<script type="text/javascript" src="/js/webtoolkit.md5.js"></script>
<script type="text/javascript" src="/js/KalturaClientBase.js"></script>
<script type="text/javascript" src="/js/KalturaTypes.js"></script>
<script type="text/javascript" src="/js/KalturaVO.js"></script>
<script type="text/javascript" src="/js/KalturaServices.js"></script>
<script type="text/javascript" src="/js/KalturaClient.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<!-- The jQuery UI widget factory, can be omitted if jQuery UI is already included -->
<script src="/js/vendor/jquery.ui.widget.js"></script>
<!-- The Templates plugin is included to render the upload/download listings -->

<script src="http://blueimp.github.io/JavaScript-Templates/js/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="https://blueimp.github.io/JavaScript-Load-Image/js/load-image.all.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="http://blueimp.github.io/JavaScript-Canvas-to-Blob/js/canvas-to-blob.min.js"></script>
<!-- Bootstrap JS is not required, but included for the responsive demo navigation -->
<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
<!-- blueimp Gallery script -->
<script src="http://blueimp.github.io/Gallery/js/jquery.blueimp-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="/js/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="/js/jquery.fileupload.js"></script>
<!-- The File Upload processing plugin -->
<script src="/js/jquery.fileupload-process.js"></script>

<!-- The File Upload image preview & resize plugin -->
<script src="/js/jquery.fileupload-image.js"></script>
<!-- The File Upload audio preview plugin -->
<script src="/js/jquery.fileupload-audio.js"></script>
<!-- The File Upload video preview plugin -->
<script src="/js/jquery.fileupload-video.js"></script>

<!-- The File Upload validation plugin -->
<script src="/js/jquery.fileupload-validate.js"></script>


<!-- The File Upload user interface plugin -->
<script src="/js/jquery.fileupload-ui.js"></script>

<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="/js/cors/jquery.xdr-transport.js"></script>
<![endif]-->

<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE8+ -->
<!--[if gte IE 8]><script src="/js/cors/jquery.xdr-transport.js"></script><![endif]-->
<script src="/js/webtoolkit.md5.js"></script>
<script src="/js/jquery.fileupload-kaltura.js"></script>
<script src="http://player.kaltura.com/mwEmbedLoader.php"></script>
<script src="http://player.kaltura.com/kWidget/kWidget.auth.js"></script>

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
