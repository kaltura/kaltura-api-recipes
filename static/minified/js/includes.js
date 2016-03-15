(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("86f681be6799f4750b83c8c1509420b2");
;
window.KC = null;
window.credentialFields = ['partnerId', 'userId', 'secret']
window.credentialsChanged = window.startKalturaSession = function(creds, cb) {
  if (!creds.partnerId || !creds.secret) return;
  var config = new KalturaConfiguration(creds.partnerId);
  config.serviceUrl = "https://www.kaltura.com/";
  window.KC = new KalturaClient(config);
  KC.session.start(function(success, ks) {
    if (!success || (ks.code && ks.message)) {
      var trackObj = ks || {};
      console.lot('fail', trackObj);
      mixpanel.track('kaltura_session_error', trackObj);
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
          $('#Recipe').scope().answers['uiConf'] = results.objects[0].id;
          if (RECIPE.name === 'dynamic_thumbnails') {
            $('#Recipe').scope().globalError = 'This recipe requires an HTML5 enabled uiConf. Please use the KMC to create one.';
          } else if (RECIPE.name === 'captions') {
            $('#Recipe').scope().globalError = 'This recipe requires a uiConf with captions enabled. Please use the KMC to create one.';
          }
        } else {
          $('#Recipe').scope().answers['uiConf'] = uiConfs[0].id;
        }
      })
    }
  }, creds.secret,
  creds.userId,
  KalturaSessionType.ADMIN,
  creds.partnerId) 
}

;
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
  if (data === null) return {type: 'success', message: "Success"};
  if (data instanceof Document) {
    var err = $(data).find('error').length;
    if (err) return {type: 'danger', message: $(data).find('error message').text()};
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) return {type: 'danger', message: data.code + ': ' + data.message};
  }
  return {type: 'success', message: 'Success'}
}
;
window.resolveDynamicEnum = function(dc, callback) {
  if (!KC) return console.log('Error: Kaltura Client is null');
  console.log('dc', dc);
  var action = dc.action, service = dc.service;
  if (action === 'list') action += 'Action';
  var args = dc.arguments || [];
  args = args.map(function(arg) {
    var cls = new window[arg.class];
    var params = arg.parameters || {};
    for (name in params) {
      var param = params[name];
      if (param.answer) {
        cls[name] = $('#Answers').scope().answers[param.answer];
      } else if (param.enum) {
        cls[name] = window[param.enum][param.value];
      } else {
        cls[name] = param;
      }
    };
    return cls;
  });
  var kcb = function(success, results) {
    if (!success || (results.code && results.message)) {
      console.log("Kaltura Error", results);
      return callback(new Error('Error getting choices'));
    }
    var choices = results.objects.map(function(obj) {
      return {value: obj[dc.map.value], label: obj[dc.map.label]};
    });
    callback(null, choices);
  };
  args.unshift(kcb);
  var serviceObj = KC[service];
  serviceObj[action].apply(serviceObj, args);
}
