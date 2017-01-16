KalturaMediaEntryFilter filter = new KalturaMediaEntryFilter();
Filter.NameLike = "foobar";
Filter.StatusEqual = KalturaEntryStatus.READY;
Filter.AdvancedSearch = new KalturaAttributeCondition();
Filter.AdvancedSearch.Value = "baz";
KalturaFilterPager pager = new KalturaFilterPager();
Pager.PageSize = 3;

Object result = client.MediaService.List(filter, pager);
Console.WriteLine(result);