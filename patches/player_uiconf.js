module.exports = function(recipe) {
  recipe.steps[0].apiCall.path = '/service/uiconf/action/get';
  recipe.steps[0].parameters[0].global = true;
  recipe.steps[0].parameters[0].dynamicEnum = require('./enum')('uiconf');

  delete recipe.steps[1].codeSnippet;
  recipe.steps[1].apiCall = {
    path: '/service/uiconf/action/update',
    method: 'get',
  }
  recipe.steps[1].parameters = [
    recipe.steps[0].parameters[0],
  {
    name: 'uiConf[config]',
    'x-inputType': 'textarea',
    dynamicValue: {fromStep: 0, value: 'config'},
  }]
}
