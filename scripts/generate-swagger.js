var converter = require('api-spec-converter');
var ksc = require('kaltura-spec-converter');
converter.Formats['kaltura'] = ksc.kalturaFormat;
var fs = require('fs');

converter.convert({
  from: 'kaltura',
  to: 'swagger_2',
  source: 'http://www.kaltura.com/api_v3/api_schema.php',
}).then(function(spec) {
  var swagger = spec.spec;
  var recipes = require('../recipes-v2').recipes;
  var recipeLinks = {};
  for (var name in recipes.recipes) {
    var recipe = recipes.recipes[name];
    var links = recipe.console_links || [];
    links.forEach(function(link) {
      recipeLinks[link] = recipeLinks[link] || [];
      recipeLinks[link].push(name);
    })
  }
  for (var path in recipeLinks) {
    if (!swagger.paths[path]) throw new Error("No path " + path);
    var op = swagger.paths[path].get;
    op.description = op.description || '';
    if (op.description) op.description += '\n\n';
    op.description += [
      'You can learn more about this operation in the following recipes:',
    ].concat(recipeLinks[path].map(function(recipeName) {
      var recipe = recipes.recipes[recipeName];
      return '* [' + recipe.title + '](/recipes/' + recipeName + ') - ' + recipe.description;
    })).join('\n');
  }
  fs.writeFileSync(__dirname + '/../swagger/swagger.json', JSON.stringify(swagger, null, 2));
}).error(function(err) {
  if (typeof err === 'string') {
    console.log('err', err.substring(0, 10))
    throw "Conversion failed."
  }
  throw err
})
