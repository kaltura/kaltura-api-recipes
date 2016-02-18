window.KC = null;
window.credentialFields = ['partnerId', 'userId', 'secret']
window.credentialsChanged = window.startKalturaSession = function(creds, cb) {
  if (!creds.partnerId || !creds.secret) return;
  console.log('starting', creds)
  var config = new KalturaConfiguration(creds.partnerId);
  config.serviceUrl = "https://www.kaltura.com/";
  window.KC = new KalturaClient(config);
  KC.session.start(function(success, ks) {
    console.log('started', success, ks);
    if (!success || (ks.code && ks.message)) {
      mixpanel.track('kaltura_session_error', {
        code: ks.code,
        message: ks.message,
      });
      cb(ks);
      return console.log('Kaltura Error', success, ks);
    }
    mixpanel.track('kaltura_session', {
      partnerId: creds.partnerId
    });
    KC.setKs(ks);
    if (cb) cb(null, ks);
    if (window.RECIPE) {
      KC.uiConf.listAction(function(success, results) {
        var uiConfs = results.objects;
        if (RECIPE.name === 'captions') {
          uiConfs = uiConfs.filter(function(uiConf) {
            return uiConf.confFile.indexOf('Plugin id="closedCaptions') !== -1;
          })
        } else {
          uiConfs = uiConfs.filter(function(uiConf) {
            return uiConf.tags && uiConf.tags.indexOf('html5studio') !== -1;
          })
        }
        if (uiConfs.length === 0) {
          $('#Answers').scope().answers['uiConf'] = results.objects[0].id;
          if (RECIPE.name === 'dynamic_thumbnails') {
            $('#Recipe').scope().globalError = 'This recipe requires an HTML5 enabled uiConf. Please use the KMC to create one.';
          } else if (RECIPE.name === 'captions') {
            $('#Recipe').scope().globalError = 'This recipe requires a uiConf with captions enabled. Please use the KMC to create one.';
          }
        } else {
          $('#Answers').scope().answers['uiConf'] = uiConfs[0].id;
        }
      })
    }
  }, creds.secret,
  creds.userId,
  KalturaSessionType.ADMIN,
  creds.partnerId) 
}

