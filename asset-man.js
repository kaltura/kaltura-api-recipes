var fs = require('fs');

var assetMan = module.exports = new (require('bb-asset-manager'))({
  staticDirectory: __dirname + '/static',
  outputDirectory: 'minified',
});

assetMan.addAsset('includes', {
  js: [
    '/js/includes/mixpanel.js',
    '/js/includes/kc-setup.js',
    '/js/includes/console.js',
  ],
});
assetMan.addAsset('kaltura', {
  js: [
    '/js/kaltura/ox.ajast.js',
    '/js/kaltura/webtoolkit.md5.js',
    '/js/kaltura/KalturaClientBase.js',
    '/js/kaltura/KalturaTypes.js',
    '/js/kaltura/KalturaVO.js',
    '/js/kaltura/KalturaServices.js',
    '/js/kaltura/KalturaClient.js',
  ],
});

assetMan.addAsset('core', {
  js: [
    "/bower/jquery/dist/jquery.min.js",
    "/bower/bootstrap/dist/js/bootstrap.min.js",
    "/bower/angular/angular.min.js",
    "/bower/marked/lib/marked.js",
    "/bower/angular-marked/dist/angular-marked.js",
    "/js/ng/locations.js",
    "/js/includes/mixpanel.js",
    "/js/ng/cookie.js",
    "/js/ng/app.js",
  ],
  css: [
    '/bower/fontawesome/css/font-awesome.min.css',
    '/css/bootstrap.css',
    '/css/navbar.css',
  ],
})

assetMan.compile();
