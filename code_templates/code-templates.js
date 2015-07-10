var Templates = module.exports = {};

var FS = require('fs');
var Path = require('path');

var populateTemplates = function(type) {
  Templates[type] = {};
  var tmpls = FS.readdirSync(Path.join(__dirname, type));
  tmpls.forEach(function(tmpl) {
    var ext = Path.extname(tmpl);
    var name = Path.basename(tmpl, ext);
    var contents = FS.readFileSync(Path.join(__dirname, type, tmpl), 'utf8');
    Templates[type][name] = contents;
  })
}

var types = ['actions', 'views', 'setups'];
types.forEach(populateTemplates);
