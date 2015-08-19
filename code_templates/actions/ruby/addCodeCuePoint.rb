cuePoint = KalturaCodeCuePoint.new();
cuePoint.code = params[:code];
cuePoint.description = params[:description]
cuePoint.start_time = params[:startTime];
cuePoint.entry_id = <%- Lucy.code.variable('answers.entryIdEqual') %>;
result = @@client.cue_point_service.add(cuePoint);
<%- Lucy.returnCode('result') %>
