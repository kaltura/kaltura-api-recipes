var Recipes = module.exports = {};

var FS = require('fs');
var Path = require('path');

var AuthStep = require('./includes/auth.js');

var files = FS.readdirSync(__dirname);
var thisFile = Path.basename(__filename);

var BLACKLIST = ['app_tokens', 'live_broadcast'];

files.forEach(function(filename) {
  if (filename === thisFile) return;
  filename = Path.join(__dirname, filename);
  if (FS.statSync(filename).isDirectory()) return;
  var ext = Path.extname(filename);
  var name = Path.basename(filename, ext);
  if (BLACKLIST.indexOf(name) !== -1) return;
  try {
    if (ext === '.json') {
      Recipes[name] = JSON.parse(FS.readFileSync(filename, 'utf8'));
    } else if (ext === '.js') {
      Recipes[name] = require(filename);
    }
  } catch (e) {
    console.log('Error parsing recipe ' + name);
    throw e;
  }
  var auth = Recipes[name].needsAdmin ? AuthStep.admin : AuthStep.sessionSelect;
  Recipes[name].control_sets.unshift(auth);
  Recipes[name].defaults = Recipes[name].defaults || {};
  Recipes[name].defaults.serviceURL =
      process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/';
});
