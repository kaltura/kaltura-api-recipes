var filter = new Kaltura.objects.KalturaMediaEntryFilter();
filter.nameLike = "foobar";
filter.statusEqual = Kaltura.enums.KalturaEntryStatus.READY;
filter.advancedSearch = new Kaltura.objects.KalturaAttributeCondition();
filter.advancedSearch.value = "baz";

var pager = new Kaltura.objects.KalturaFilterPager();
pager.pageSize = 3;

client.media.listAction(function(results) {
  if (results && results.code && results.message) {
    console.log('Kaltura Error', results);
  } else {
    console.log('Kaltura Result', results);
  }
},
filter,
pager);
