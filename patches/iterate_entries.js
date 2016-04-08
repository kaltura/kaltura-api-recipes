var _ = require('lodash');

module.exports = function(recipe) {
  recipe.hidden = false;
  recipe.steps[0].apiCall = {
    path: '/service/media/action/list',
    method: 'get',
  }
  recipe.steps[0].parameters = [
    {name: 'pager[pageSize]'},
    {name: 'pager[pageIndex]'},
  ];
  delete recipe.steps[0].codeSnippet;

  recipe.steps[1] = JSON.parse(JSON.stringify(recipe.steps[0]));
  recipe.steps[1].parameters[0]['x-consoleDefault'] = 1;
  recipe.steps[1].parameters[1].dynamicValue = {
    fromStep: 0,
    value: 'totalCount',
  }
  recipe.steps[1].description = [
    "Once you've exhausted all entries by increasing `pageIndex`, the API will simply" +
        "return an empty array.",
    "Below we've set `pageSize` to 1, and `pageIndex` to the total number of entries available," +
        "  causing the last item to be shown. Try increasing the `pageIndex` to see how the API responds.",
  ]
}
