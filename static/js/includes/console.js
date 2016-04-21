window.checkResponse = function(data, status, xhr) {
  var msg = {type: 'success', message: "Success"};
  if (data === null) return msg;
  if (data instanceof Document) {
    var $data = $(data);
    if ($data.find('error').length) {
      var code = $data.find('code').text();
      var message = $data.find('error message').text();
      msg = {type: 'danger', message: code + ': ' + message};
    }
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) msg = {type: 'danger', message: data.code + ': ' + data.message};
    if (window.RECIPE && data.objectType === 'KalturaUiConfListResponse') {
      data.objects = data.objects.filter(function(uiConf) {
        return (uiConf.html5Url || '').indexOf('/v2') !== -1;
      });
    }
  }
  if (msg.message.indexOf('SERVICE_FORBIDDEN') !== -1) {
    $('#KalturaLogin').modal('show');
  }
  return msg;
}

window.saveRecipe = function(recipe, callback) {
  var params = {
    client_id: '1b76941133d82f454418',
    redirect_uri: 'http://54.201.161.188:3000/oauth_callback.html',
    scope: 'public_repo',
  }
  window.onOAuthComplete = function() {
    console.log('done', arguments);
    callback(null, 'Authorized');
  }
  window.open('https://github.com/login/oauth/authorize?' + $.param(params), '_blank');
}
