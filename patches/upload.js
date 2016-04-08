module.exports = function(recipe) {
  recipe.steps[0] = {
    title: "Uploading Files - Create an Upload Token",
    description: "Use the uploadToken service to upload a new video file to the Kaltura API." +
        " First you'll need to use `uploadToken.add` to create a new upload token.",
    apiCall: {
      path: '/service/uploadtoken/action/add',
      method: 'get',
    },
    parameters: [],
  };

  recipe.steps.splice(1, 0, {
    title: "Uploading Files - Send the Data",
    description: [
      "Now we'll use the newly created Upload Token to upload a video file.",
      "If you don't have a video file handy, you can right-click " +
          "[this link](/this-is-my-jam.mp4) and choose **Save As**.",
    ],
    apiCall: {
      path: '/service/uploadtoken/action/upload',
      method: 'post',
    },
    parameters: [
      {name: 'uploadTokenId', dynamicValue: {fromStep: 0, value: 'id'}},
      {name: 'fileData'},
    ]
  });

  recipe.steps[2] = {
    title: 'Creating a Media Entry',
    description: 'Now we\'ll create a Media Entry to hold our video. Use the form below to enter your video\'s details.',
    apiCall: {
      path: '/service/media/action/add',
      method: 'get',
    },
    parameters: [
      {name: 'entry[mediaType]'},
      {name: 'entry[name]'},
      {name: 'entry[description]'},
    ],
  }

  recipe.steps.push({
    title: 'Attach the Video',
    description: 'Now that you\'ve created a new Media Entry, you need to associate the uploaded video with it.',
    apiCall: {
      path: '/service/media/action/addContent',
      method: 'get',
    },
    parameters: [
      {name: 'resource[objectType]', 'x-consoleDefault': 'KalturaUploadedFileTokenResource'},
      {name: 'entryId', dynamicValue: {fromStep: 2, value: 'id'}},
      {name: 'resource[token]', dynamicValue: {fromStep: 0, value: 'id'}},
    ],
  });

  recipe.steps.push({
    title: 'Viewing your Video',
    description: "You can use kWidget to embed your video in HTML. The video may not be ready for a minute, so" +
        " you can poll its status with `media.get` by hitting 'Send Request'.",
    apiCall: {path: '/service/media/action/get', method: 'get'},
    parameters: [
      {name: 'uiConf', dynamicEnum: require('./enum')('uiconf')},
      {name: 'entryId', dynamicValue: {fromStep: 2, value: 'id'}, hidden: true}
    ],
  })
}
