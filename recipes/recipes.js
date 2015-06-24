var Recipes = module.exports = {};

var FS = require('fs');
var Path = require('path');

var files = FS.readdirSync(__dirname + '/kaltura');
files.forEach(function(filename) {
  var name = filename.substring(0, filename.length - 5);
  Recipes[name] = JSON.parse(FS.readFileSync(Path.join(__dirname, 'kaltura', filename), 'utf8'));
});
