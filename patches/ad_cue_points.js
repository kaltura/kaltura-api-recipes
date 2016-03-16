module.exports = function(recipe) {
  var mediaParam = recipe.steps[0].parameters[1];
  require('./crud')(recipe, {
    name: 'Ad Cue Point',
    service: 'cuePoint',
    serviceName: 'cuepoint_cuepoint',
  });
  recipe.steps[0].parameters = [mediaParam];
  recipe.steps[0].parameters.push({
    name: 'filter[objectType]',
    value: 'KalturaAdCuePointBaseFilter',
    hidden: true,
  });
  recipe.steps[0].description += '\n\nUse a `KalturaAdCuePointBaseFilter` to retrieve only Ad cue points.';

  recipe.steps[1].description = "Use the controls below to add a new cue point to one of your videos";
  recipe.steps[1].parameters = [
    {name: 'cuePoint[entryId]'},
    {name: 'cuePoint[sourceUrl]'},
    {name: 'cuePoint[startTime]'},
    {name: 'cuePoint[objectType]', default: 'KalturaAdCuePoint', hidden: true},
  ]
  recipe.steps[1].parameters[0].dynamicEnum = recipe.steps[0].parameters[0].dynamicEnum;
  recipe.steps[1].parameters[0].dynamicValue = {fromStep: 0, answer: 'filter[entryIdEqual]'};

  recipe.steps.splice(3, 0, {
    title: 'Viewing your Advertisement',
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
