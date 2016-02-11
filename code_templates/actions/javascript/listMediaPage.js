    console.log('hi');
  $('#listMediaPage').submit(function() {
    console.log("here");
    var pager = new KalturaFilterPager();
    pager.pageIndex=2;
    client.media.list(function(success,results) {
    <%- Lucy.returnCode('results') %>
    }, null, pager);
    return false;
  })
