module.exports = function(recipe) {
  recipe.steps[1].apiCall = {
    path: '/service/apptoken/action/add',
    method: 'get',
  };
  delete recipe.steps[1].codeSnippet;
  delete recipe.steps[1].parameters;

  recipe.steps.push({
    title: 'Deleting an App Token',
    description: 'Use `appToken.delete` to invalidate your new App Token',
    parameters: [
      {name: 'id', dynamicValue: {fromStep: 1, value: 'id'}},
    ],
    apiCall: {
      path: '/service/apptoken/action/delete',
      method: 'get',
    }
  })
}
