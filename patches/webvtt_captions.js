module.exports = function(recipe) {
  var origParams = recipe.steps[0].parameters;
  require('./crud')(recipe, {
    name: 'Caption Asset',
    service: 'captionAsset',
    serviceName: 'caption_captionasset',
  });

  recipe.steps[0].parameters = [{
    name: 'filter[entryIdEqual]',
    dynamicEnum: require('./enum')('media'),
  }];

  recipe.steps.splice(1, 0, {
    title: "Uploading Captions - Create an Upload Token",
    description: "Use the uploadToken service to upload an WebVTT file to the Kaltura API." +
        " If you don't have an WebVTT file handy, you can" +
        " [download one here](/sample_captions.srt)\n\n" +
        "First you'll need to use `uploadToken.add` to create a new upload token." +
        " In the next step we'll use this token to upload the WebVTT data.",
    apiCall: {
      path: '/service/uploadtoken/action/add',
      method: 'get',
    },
    parameters: [],
  })

  recipe.steps.splice(2, 0, {
    title: "Uploading Captions - Send the WebVTT Data",
    description: "Now we'll use the newly created Upload Token to upload the WebVTT file.",
    apiCall: {
      path: '/service/uploadtoken/action/upload',
      method: 'post',
    },
    parameters: [
      {name: 'uploadTokenId', dynamicValue: {fromStep: 1, value: 'id'}},
      {name: 'fileData'},
    ]
  })

  recipe.steps[3].parameters = [
    {name: 'entryId', dynamicValue: {fromStep: 0, answer: 'filter[entryIdEqual]'}},
    {name: 'captionAsset[language]', default: "English"},
    {name: 'captionAsset[label]'},
    {name: 'captionAsset[isDefault]'},
    {name: 'captionAsset[format]', default: "3"},
  ];

  recipe.steps[4].parameters[0].name = 'captionAssetId';
  recipe.steps[4].parameters[0].dynamicValue = {fromStep: 3, value: 'id'};

  recipe.steps.splice(5, 0, {
    title: "Serving WebVTT Captions",
    description: 'Use `captionAsset.serveWebVTT` to serve your captions',
    apiCall: {
      path: '/service/caption_captionasset/action/serveWebVTT',
      method: 'get'
    },
    parameters: [
      {name: 'captionAssetId', dynamicValue: {fromStep: 3, value: 'id'}},
    ]
  });

  recipe.steps[6].parameters[0].name = 'captionAssetId';
  recipe.steps[6].parameters[0].dynamicValue = {fromStep: 3, value: 'id'};
}
