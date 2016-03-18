module.exports = function(recipe) {
  var type = recipe.steps[0].parameters.shift();
  recipe.steps[0].parameters.shift();
  type.hidden = false;
  recipe.steps[0].parameters.push(type);
  recipe.steps[0].description += '\n\nSet `cuePointTypeEqual` to `QUIZ_QUESTION` to only show quizes.';

  recipe.steps[1].title = 'Adding a Quiz Cue Point';
  recipe.steps[1].description = [
    'Pass a new KalturaQuestionCuePoint to `cuePoint.add` to create a new quiz.',
    'You can use the form below to add a quiz to the video you selected.',
  ];
  recipe.steps[1].apiCall = {
    path: '/service/cuepoint_cuepoint/action/add',
    method: 'get',
  }
  recipe.steps[1].parameters = [{
    name: 'cuePoint[objectType]',
    'x-consoleDefault': 'KalturaQuestionCuePoint',
    hidden: true,
  }, {
    name: 'cuePoint[entryId]',
    hidden: true,
    dynamicValue: {fromStep: 0, answer: 'filter[entryIdEqual]'}
  }, {
    name: 'cuePoint[question]',
  }, {
    name: 'cuePoint[explanation]',
  }, {
    name: 'cuePoint[startTime]',
  }];
}
