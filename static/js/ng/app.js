var app = angular.module('app', ['hljs', 'zeroclipboard', 'hc.marked']);
app.config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {
  uiZeroclipConfigProvider.setZcConf({
    swfPath: '/bower/zeroclipboard/dist/ZeroClipboard.swf'
  });
}])
app.config(['markedProvider', function(markedProvider) {
  markedProvider.setRenderer({
    link: function(href, title, text) {
      return "<a href='" + href + "' title='" + title + "' target='_blank'>" + text + "</a>";
    }
  });
}]);
