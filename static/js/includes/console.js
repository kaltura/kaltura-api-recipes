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
    });
  }
}
startKS();
