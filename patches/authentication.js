module.exports = function(recipe) {
  recipe.steps[0].apiCall = {
    path: '/service/session/action/start',
    method: 'get',
  }
  delete recipe.steps[0].codeSnippet;
}
