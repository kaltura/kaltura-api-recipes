var fs = require('fs');
module.exports = function(recipe) {
  recipe.steps[0] = {
    title: 'Embedding Custom Thumbnails',
    description: [
      'You can embed thumbnails of your videos using <img> tags with the Thumbnail API.',
      'Choose a Media Entry to view code for embedding it\'s thumbnail',
    ],

    apiCall: {
      path: '/service/media/action/get',
      method: 'get',
    },
    parameters: [
      {name: 'entryId', dynamicEnum: require('./enum')('media')},
    ],
  }
  recipe.steps[0].codeSnippet = {html: fs.readFileSync(__dirname + '/html/Thumbnail.html', 'utf8')};
  recipe.steps[0].demoHTML = recipe.steps[0].codeSnippet.html;

  recipe.steps[1] = {
    title: 'Creating a Thumbnail Viewer',
    description: "You can use the Thumbnail API to create an interactive video carousel.",
    apiCall: {
      path: '/service/media/action/list',
      method: 'get',
    },
    parameters: [{name: 'uiConf', dynamicEnum: require('./enum')('uiconf')}],
  }
  recipe.steps[1].codeSnippet = {html: fs.readFileSync(__dirname + '/html/DynamicThumbnails.html', 'utf8')};
  recipe.steps[1].demoHTML = recipe.steps[1].codeSnippet.html;
}
