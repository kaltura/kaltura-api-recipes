var FS = require('fs');
var Views = require('kaltura-codegen').views;

var Swagger = module.exports = require('./static/swagger.json');

Swagger.info['x-lucy/readme'] = FS.readFileSync(__dirname + '/static/README.md', 'utf8')

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
