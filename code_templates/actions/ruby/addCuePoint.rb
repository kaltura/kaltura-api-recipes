cuePoint = KalturaAdCuePoint.new();
cuePoint.source_url = params[:sourceUrl]
cuePoint.start_time = params[:startTime]
cuePoint.entry_id = <%- Lucy.code.variable('answers.entryIdEqual') %>
result = @@client.cue_point_service.add(cuePoint)
render json: result
