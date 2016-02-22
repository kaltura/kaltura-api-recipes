var FS = require('fs');
var Views = require('kaltura-codegen').views;

var Swagger = module.exports = require('kaltura-spec-converter').swagger;

var README = FS.readFileSync(__dirname + '/static/README.md', 'utf8');
README = require('markdown-sections')(README);
Swagger.info['x-lucy/readme'] = README.map(function(section) {
  var title = section.match(/# (.*)\n/)[1];
  return {title: title, contents: section};
});
Swagger.info['x-lucy/readme'].push({
  title: 'Error Codes',
  contents: FS.readFileSync(__dirname + '/static/errors.md', 'utf8'),
})

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
  var recipes = new (require('./recipes/recipes.js'))({schema: Schema});
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
