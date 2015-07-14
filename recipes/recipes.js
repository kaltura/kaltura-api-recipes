var Recipes = module.exports = {};

var FS = require('fs');
var Path = require('path');

var files = FS.readdirSync(__dirname);
var thisFile = Path.basename(__filename);
files.forEach(function(filename) {
  if (filename === thisFile) return;
  var name = filename.substring(0, filename.length - 5);
  try {
    Recipes[name] = JSON.parse(FS.readFileSync(Path.join(__dirname, filename), 'utf8'));
  } catch (e) {
    console.log('Error parsing recipe ' + name);
    throw e;
  }
});
