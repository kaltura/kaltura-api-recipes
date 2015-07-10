var Templates = module.exports = {};

var FS = require('fs');
var Path = require('path');

var populateTemplates = function(type) {
  Templates[type] = {};
  var tmpls = FS.readdirSync(Path.join(__dirname, type));
  tmpls.forEach(function(tmpl) {
    var ext = Path.extname(tmpl);
    var name = Path.basename(tmpl, ext);
    var filename = Path.join(__dirname, type, tmpl);
    if (type === 'views' || type === 'actions') {
      var lang = name;
      var tmplsInner = FS.readdirSync(filename);
      tmplsInner.forEach(function(tmplInner) {
        ext = Path.extname(tmplInner);
        name = Path.basename(tmplInner, ext);
        var filenameInner = Path.join(__dirname, type, lang, tmplInner);
        Templates[type][name] = Templates[type][name] || {};
        Templates[type][name][lang] = FS.readFileSync(filenameInner, 'utf8');
      })
    } else {
      Templates[type][name] = FS.readFileSync(filename, 'utf8');
    }
  });
}

var types = ['actions', 'views', 'generic_actions', 'setups'];
types.forEach(populateTemplates);
