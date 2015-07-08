var app = angular.module('app', ['hljs', 'zeroclipboard', 'hc.marked']);
app.config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {
  uiZeroclipConfigProvider.setZcConf({
    swfPath: '/bower/zeroclipboard/dist/ZeroClipboard.swf'
  });
}])
