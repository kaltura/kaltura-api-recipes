module.exports = function(recipe) {
  recipe.steps[0].title = "Get Existing Cue Points"
  recipe.steps[0].parameters.shift();

  delete recipe.steps[1].codeSnippet;
  recipe.steps[1].description = "Use the controls below to add a new cue point to one of your videos";
  recipe.steps[1].apiCall = {
    path: '/service/cuepoint_cuepoint/action/add',
    method: 'get',
  }
  recipe.steps[1].parameters = [
    {name: 'cuePoint[entryId]'},
    {name: 'cuePoint[sourceUrl]'},
    {name: 'cuePoint[startTime]'},
    {name: 'cuePoint[objectType]', default: 'KalturaAdCuePoint', hidden: true},
  ]
  recipe.steps[1].parameters[0].dynamicEnum = recipe.steps[0].parameters[0].dynamicEnum;
  return recipe;
}
