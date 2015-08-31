var Recipes = module.exports = {};

var FS = require('fs');
var Path = require('path');

var AuthStep = require('./includes/auth.js');

var files = FS.readdirSync(__dirname);
var thisFile = Path.basename(__filename);

var BLACKLIST = ['app_tokens', 'live_broadcast'];

files.forEach(function(filename) {
  if (filename === thisFile) return;
  var name = filename.substring(0, filename.length - 5);
  if (BLACKLIST.indexOf(name) !== -1) return;
  filename = Path.join(__dirname, filename);
  if (FS.statSync(filename).isDirectory()) return;
  try {
    Recipes[name] = JSON.parse(FS.readFileSync(filename, 'utf8'));
  } catch (e) {
    console.log('Error parsing recipe ' + name);
    throw e;
  }
  var recipe = Recipes[name];
  var auth = recipe.needsAdmin ? AuthStep.admin : AuthStep.sessionSelect;
  recipe.control_sets.unshift(auth);
  recipe.defaults = recipe.defaults || {};
  recipe.defaults.serviceURL =
      process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/';
  recipe.actions = recipe.actions || [];
  recipe.actions.forEach(function(action) {
    if (action.service) action.action += action.service.charAt(0).toUpperCase() + action.service.substring(1);
  })
});
