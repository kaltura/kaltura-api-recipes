$total_media_entries = $client->media->count($filter);
$pager = new KalturaFilterPager();
$pager->pageSize = 500; 
$pager->pageIndex=$_POST['page_index'];
$result = $client->media->listAction($filter, $pager);
<%- Lucy.returnCode('$result') %>

