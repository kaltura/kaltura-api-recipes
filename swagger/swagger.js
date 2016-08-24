var FS = require('fs');
var Views = require('kaltura-codegen').templates.views;

var Swagger = module.exports = require('./swagger.json');
Swagger['x-navigation'] = require('./navigation.js');
Swagger['x-lucy/viewSetup'] = FS.readFileSync(__dirname + '/../node_modules/kaltura-codegen/code_templates/setups/html.html', 'utf8')

for (var name in Views) {
  var def = Swagger.definitions[name] = Swagger.definitions[name] || {};
  var view = Views[name].all || '';
  if (def.properties && def.properties.objects) view = view.replace(/result(["'\[])/g, 'result.objects$1');
  if (view) def['x-lucy/view'] = view;
}

for (var path in Swagger.paths) {
  for (var method in Swagger.paths[path]) {
    var op = Swagger.paths[path][method];
    var resp = op.responses['200'];
    var returns = resp.schema ? resp.schema.$ref : '';
    if (returns) {
      returns = returns.substring('#/definitions/'.length);
      resp['x-lucy/view'] = Swagger.definitions[returns]['x-lucy/view'];
    }
  }
}

var Schema = require('kaltura-schema');
Schema.initialize(function() {
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
    if (!Swagger.paths[path]) throw new Error("No path " + path);
    var op = Swagger.paths[path].get;
    op.description = op.description || '';
    if (op.description) op.description += '\n\n';
    op.description += [
      'You can learn more about this operation in the following recipes:',
    ].concat(recipeLinks[path].map(function(recipeName) {
      var recipe = recipes.recipes[recipeName];
      return '* [' + recipe.title + '](/recipes/' + recipeName + ') - ' + recipe.description;
    })).join('\n');
  }
})
