var fs = require('fs');
module.exports = function(recipe) {
  recipe.title = "Animated Thumbnails with CSS Stripes";
  recipe.steps[0] = {
    title: 'Embedding Custom Thumbnails',
    description: [
      'You can embed thumbnails of your videos using <img> tags with the Thumbnail API.',
      'Choose a Media Entry to view code for embedding it\'s thumbnail',
      'Once the demo loads, try mousing over the thumbnail to see a preview of the video.',
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

  recipe.steps.pop();
}
