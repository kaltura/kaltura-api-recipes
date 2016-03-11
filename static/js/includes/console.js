window.credentialFields = ['ks'];

var startKS = function() {
  var keys = window.getKeys();
  if (!keys.partnerId && !keys.secret) {
    setTimeout(startKS, 1000);
  }
  else {
    window.startKalturaSession(keys, function(err, ks) {
      keys.ks = ks;
      window.setKeys(keys);
      KC.uiConf.listAction(function(suc, confs) {
        window.DEFAULT_ANSWERS = {uiConf: confs.objects[0].id}
      })
    });
  }
}
startKS();

window.checkResponse = function(data, status, xhr) {
  if (data === null) return {type: 'danger', message: 'Status Code ' + xhr.status + ': ' + xhr.responseText};
  if (data instanceof Document) {
    var err = $(data).find('error').length;
    if (err) return {type: 'danger', message: $(data).find('error message').text()};
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) return {type: 'danger', message: data.code + ': ' + data.message};
  }
  return {type: 'success', message: 'Success'}
}
