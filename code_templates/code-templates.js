var Templates = module.exports = {};

var FS = require('fs');
var Path = require('path');

Templates.actions = {};
var actionTmpls = FS.readdirSync(__dirname + '/actions');
actionTmpls.forEach(function(tmpl) {
  var ext = Path.extname(tmpl).substring(1);
  var contents = FS.readFileSync(Path.join(__dirname, 'actions', tmpl), 'utf8');
  Templates.actions[ext] = contents;
});

Templates.views = {};
var viewTmpls = FS.readdirSync(__dirname + '/views');
viewTmpls.forEach(function(tmpl) {
  var ext = Path.extname(tmpl);
  var name = Path.basename(tmpl, ext);
  var contents = FS.readFileSync(Path.join(__dirname, 'views', tmpl), 'utf8');
  Templates.views[name] = contents;
});
