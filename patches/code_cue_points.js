module.exports = function(recipe) {
  var origParams = recipe.steps[0].parameters;
  require('./crud')(recipe, {
    name: 'Cue Point',
    service: 'cuePoint',
    serviceName: 'cuepoint_cuepoint',
  });
  recipe.steps[0].parameters = origParams;
  recipe.steps[0].parameters[1].dynamicEnum.parameters.pop();
  recipe.steps[0].parameters.splice(1, 1);

  recipe.steps[1].description = "Use the controls below to add a new cue point to one of your videos";
  recipe.steps[1].parameters = [
    {name: 'cuePoint[entryId]'},
    {name: 'cuePoint[code]'},
    {name: 'cuePoint[startTime]'},
    {name: 'cuePoint[description]'},
    {name: 'cuePoint[objectType]', default: 'KalturaCodeCuePoint', hidden: true},
  ]
  recipe.steps[1].parameters[0].dynamicEnum = recipe.steps[0].parameters[1].dynamicEnum;
  recipe.steps[1].parameters[0].dynamicValue = {fromStep: 0, answer: 'filter[entryIdEqual]'};

  recipe.steps.splice(3, 0, {
    title: 'Viewing your Cue Point',
    description: "Now you can see your new Cue Point wherever you embed your video.",
    apiCall: {
      path: '/service/media/action/get',
      method: 'get',
    },
    parameters: [
      {name: 'entryId', dynamicValue: {fromStep: 0, answer: 'filter[entryIdEqual]'}},
      {name: 'uiConf', type: 'string', dynamicEnum: {
        path: '/service/uiconf/action/list',
        method: 'get',
        array: 'objects',
        value: 'id',
        label: 'name',
      }},
    ],
  });
  return recipe;
}
