kWidget.addReadyCallback(function(playerId){
  var kdp = $('#' + playerId)[0]; 
  kdp.kBind('cuePointReached', function( qPoint ){
    var type = (qPoint.context) ? 'Ad' : 'Code';
    console.log('Cue Point:',
        type,
        qPoint.cuePoint.title,
        qPoint.cuePoint.description,
        qPoint.cuePoint.startTime);
  })
})
