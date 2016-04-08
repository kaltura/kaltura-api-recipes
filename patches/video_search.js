var fs = require('fs');
module.exports = function(recipe) {
  recipe.steps[0].parameters[2].name = 'filter[advancedSearch][objectType]';

  recipe.steps[1].apiCall = recipe.steps[0].apiCall;
  recipe.steps[1].parameters = recipe.steps[0].parameters.map(p => JSON.parse(JSON.stringify(p)));
  recipe.steps[1].parameters.forEach(function(p) {
    p.hidden = true;
    p.dynamicValue = {fromStep: 0, answer: p.name};
  });
  recipe.steps[1].parameters.unshift({
    name: 'uiConf',
    dynamicEnum: require('./enum')('uiconf'),
  });
  recipe.steps[1].codeSnippet = {html: fs.readFileSync(__dirname + '/html/KalturaMediaEntry.html', 'utf8')}
}
