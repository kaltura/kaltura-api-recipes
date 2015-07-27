var cuePoint = new Kaltura.objects.KalturaAdCuePoint();
cuePoint.sourceUrl = req.body.sourceUrl;
cuePoint.startTime = req.body.startTime;
cuePoint.entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
client.cuePoint.add(function(result) {
  res.json(result);
}, cuePoint);
