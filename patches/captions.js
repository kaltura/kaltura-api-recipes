module.exports = function(recipe) {
  recipe.steps[0].apiCall = {
    path: '/service/media/action/get',
    method: 'get',
  }
  recipe.steps[0].description = "Choose a video from your library to add captions to.";
  delete recipe.steps[0].codeSnippet;

  recipe.steps.splice(1, 0, {
    title: "Uploading Captions - Create an Upload Token",
    description: "Use the uploadToken service to upload an SRT file to the Kaltura API." +
        " If you don't have an SRT file handy, you can" +
        " [download one here](/sample_captions.srt)\n\n" +
        "First you'll need to use `uploadToken.add` to create a new upload token." +
        " In the next step we'll use this token to upload the SRT data.",
    apiCall: {
      path: '/service/uploadtoken/action/add',
      method: 'get',
    },
    parameters: [],
  })

  recipe.steps.splice(2, 0, {
    title: "Uploading Captions - Send the SRT Data",
    description: "Now we'll use the newly created Upload Token to upload the SRT." +
        " If you don't have an SRT file handy, you can" +
        " [download one here](/sample_captions.srt)",
    apiCall: {
      path: '/service/uploadtoken/action/upload',
      method: 'post',
    },
    parameters: [
      {name: 'uploadTokenId', dynamicValue: {fromStep: 1, value: 'id'}},
      {name: 'fileData'},
    ]
  })

  recipe.steps[3].title = "Creating a new Caption Asset";
  recipe.steps[3].description =
    "Next you'll need to create a Caption Asset, which describes the format, language, and label" +
    " of your captions.";
  recipe.steps[3].apiCall = {
    path: '/service/caption_captionasset/action/add',
    method: 'get',
  }
  recipe.steps[3].parameters = [
    {name: 'entryId', dynamicValue: {fromStep: 0, value: 'id'}},
    {name: 'captionAsset[language]', default: "English"},
    {name: 'captionAsset[label]'},
    {name: 'captionAsset[isDefault]'},
    {name: 'captionAsset[format]', default: "1"},
  ]
  delete recipe.steps[3].codeSnippet;

  recipe.steps.splice(4, 0, {
    title: "Setting Caption Content",
    description: "Now that you've created a new Caption Asset and uploaded your caption file," +
        " you need to associate them with each other using the" +
        " `captionAsset.setContent` method.\n\n" +
        "Set the `id` parameter to the entryId of a media item, and the `contentResource[token]` parameter " +
        " to the Upload Token's ID.",
    apiCall: {
      path: '/service/caption_captionasset/action/setContent',
      method: 'get',
    },
    parameters: [
      {name: 'id', dynamicValue: {fromStep: 3, value: 'id'}},
      {name: 'contentResource[objectType]', default: 'KalturaUploadedFileTokenResource'},
      {name: 'contentResource[token]', dynamicValue: {fromStep: 2, value: 'id'}},
    ]
  });

  recipe.steps[5].parameters[0].name = 'captionAssetItemFilter[contentLike]'
  recipe.steps[5].parameters.push({
    name: 'captionAssetItemFilter[objectType]',
    default: 'KalturaCaptionAssetItemFilter',
    hidden: true,
  })
}
