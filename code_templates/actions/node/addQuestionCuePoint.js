var entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
var quiz = new KalturaQuiz();
var filter = new KalturaQuizFilter();
filter.entryIdEqual = entryId;
var pager = null;
var result = client.quiz.listAction(function(success,result) {
    if (result.objects.length === 0){
	var attsAr = [];
	attsAr.push({'key' : 'WelcomeMessage' , 'value' : 'blah'});
	attsAr.push({'key' : 'inVideoTip' , 'value' : true});
	attsAr.push({'key' : 'canSkip' , 'value' : true});
	quiz.uiAttributes = attsAr;
	client.quiz.add(function(result) {
	},entryId,quiz);
    }

}, filter, pager);


var cuePoint = new KalturaQuestionCuePoint();
cuePoint.entryId = entryId;
cuePoint.question = req.body.question; 
cuePoint.startTime = req.body.startTime;
var optionalAnswers =  [];
optionalAnswers[0] =  [];
optionalAnswers[1] =  [];

optionalAnswers[0]={'key': 1, 'text': req.body.answer0, 'isCorrect': 1};

optionalAnswers[1]={'key': 2, 'text': req.body.answer1, 'isCorrect': 0};
console.log(optionalAnswers);
cuePoint.optionalAnswers = optionalAnswers;
client.cuePoint.add(function(result) {
<%- Lucy.returnCode('result') %>
}, cuePoint);
