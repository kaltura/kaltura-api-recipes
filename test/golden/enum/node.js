var secret = "YOUR_KALTURA_SECRET";

var userId = "YOUR_USER_ID";

var type = Kaltura.kc.enums.KalturaSessionType.USER;

var partnerId = "YOUR_PARTNER_ID";

var expiry = 0;

var privileges = "";

client.session.start(function(results) {
  if (results && results.code && results.message) {
    console.log('Kaltura Error', results);
  } else {
    console.log('Kaltura Result', results);
  }
},
secret,
userId,
type,
partnerId,
expiry,
privileges);
