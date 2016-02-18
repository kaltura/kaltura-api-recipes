var FS = require('fs');
var Views = require('kaltura-codegen').views;

var Swagger = module.exports = require('./static/swagger.json');

var README = FS.readFileSync(__dirname + '/static/README.md', 'utf8');
README = require('markdown-sections')(README);
Swagger.info['x-lucy/readme'] = README.map(function(section) {
  var title = section.match(/# (.*)\n/)[1];
  return {title: title, contents: section};
});

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
