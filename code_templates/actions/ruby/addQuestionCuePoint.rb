quiz = KalturaQuiz.new();
filter = new KalturaQuizFilter();
entry_id = <%- Lucy.code.variable('answers.entryIdEqual') %>;
filter.entryIdEqual = entry_id;
pager = null;
result = @@client.quiz_service.list(filter,pager);
if result.total_count == 0 
  # @@client.quiz_service.add(quiz);
end

optional_answers = KalturaOptionalAnswer.new();
optional_answers.key = 1
optional_answers.text = params[:answer0]
optional_answers.isCorrect = 1

optional_answers1 = KalturaOptionalAnswer.new();
optional_answers1.key = 2
optional_answers1.text = params[:answer1]
optional_answers1.isCorrect = 0

cuePoint = KalturaQuestionCuePoint.new();
cuePoint.question = params[:question];
cuePoint.start_time = params[:startTime];
cuePoint.entry_id = entry_id;
cuePoint.optional_answers=optional_answers,optional_answers1
result = @@client.cue_point_service.add(cuePoint);
<%- Lucy.returnCode('result') %>
