var Kaltura = require('kaltura');
var config = new Kaltura.KalturaConfiguration(YOUR_PARTNER_ID);
var client = new Kaltura.KalturaClient(config);
var sessionID = null;
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', ks);
  } else {
    client.setKs(ks);
    var filter = new Kaltura.objects.KalturaMediaEntryFilter();

    var pager = new Kaltura.objects.KalturaFilterPager();

    client.media.listAction(function(results) {
      if (results && results.code && results.message) {
        console.log('Kaltura Error', results);
      } else {
        console.log('Kaltura Result', results);
      }
    },
    filter,
    pager);

  }
}, "YOUR_KALTURA_SECRET",
"YOUR_USER_ID",
Kaltura.enums.KalturaSessionType.ADMIN,
YOUR_PARTNER_ID)