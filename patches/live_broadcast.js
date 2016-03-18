var fs = require('fs');
module.exports = function(recipe) {
  recipe.steps[0].parameters.shift();
  recipe.steps[0].title = 'Get the LIVE_STREAM Profile';
  recipe.steps[0].description.pop();
  recipe.steps[1].parameters[0].name = 'liveStreamEntry[name]';
  recipe.steps[1].parameters[1].name = 'liveStreamEntry[description]';

  recipe.steps[2] = {
    title: 'Embedding the Broadcast Widget',
    description: [
      'You can use the kRecord widget to record your broadcast.',
      '**Be sure to choose a `uiConf` that supports kRecord**',
    ],
    parameters: [{
      name: 'uiConf',
      dynamicEnum: require('./enum')('uiconf'),
    }]
  }
  recipe.steps[2].demoHTML = fs.readFileSync(__dirname + '/html/LiveBroadcast.html', 'utf8');
  recipe.steps[2].codeSnippet = {html: recipe.steps[2].demoHTML};
  var jsCode = recipe.steps[2].demoHTML.match(/<script>([\w\W]*)<\/script>/)[1];
  jsCode = jsCode.split('\n').map(l => l.substring(4)).join('\n');
  jsCode = jsCode.trim();
  recipe.steps[2].codeSnippet.javascript = jsCode;
}
