var cuePoint = new Kaltura.objects.KalturaCodeCuePoint();
cuePoint.code = req.body.code;
cuePoint.description = req.body.description;
cuePoint.startTime = req.body.startTime;
cuePoint.entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
client.cuePoint.add(function(result) {
  <%- Lucy.returnCode('result') %>
}, cuePoint);
