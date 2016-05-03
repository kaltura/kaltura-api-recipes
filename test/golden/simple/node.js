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
