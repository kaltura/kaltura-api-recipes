(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("86f681be6799f4750b83c8c1509420b2");
;
window.KC = null;
window.onAuthorization = function(creds, cb) {
  if (!creds.partnerId || !creds.secret) return;
  if (creds.ks && window.KC) return;
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
    $('#APICall').scope().keys.ks = ks;
    KC.setKs(ks);
    KC.uiConf.listAction(function(success, results) {
      var uiConfs = results.objects;
      if (window.RECIPE && RECIPE.name === 'captions') {
        uiConfs = uiConfs.filter(function(uiConf) {
          return uiConf.confFile.indexOf('Plugin id="closedCaptions') !== -1;
        })
      } else if (window.RECIPE) {
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
        $('#APICall').scope().globalAnswers['uiConf'] = uiConfs[0].id;
      }
      cb(null, ks);
    });
  }, creds.secret,
  creds.userId,
  KalturaSessionType.ADMIN,
  creds.partnerId) 
}

;
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
