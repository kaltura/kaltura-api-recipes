console.log('here I am');
var quiz = new KalturaQuiz();
console.log(quiz);
var attsAr = [];
attsAr.push({'key' : WelcomeMessage , 'value' : 'blah'});
attsAr.push({'key' : inVideoTip , 'value' : true});
attsAr.push({'key' : canSkip , 'value' : true});
quiz.uiAttributes = attsAr;
client.quiz.add(function(result) {
  <%- Lucy.returnCode('result') %>
}, <%- Lucy.code.variable('answers.entryIdEqual') %>,quiz);

var cuePoint = new Kaltura.objects.KalturaQuestionCuePoint();
cuePoint.quesion = req.body.question;
cuePoint.startTime = req.body.startTime;
cuePoint.entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
client.cuePoint.add(function(result) {
  <%- Lucy.returnCode('result') %>
}, cuePoint);
