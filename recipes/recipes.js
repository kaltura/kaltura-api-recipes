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
  var recipe = Recipes[name];
  var auth = recipe.needs_admin ? AuthStep.admin : AuthStep.sessionSelect;
  recipe.recipe_steps.unshift(auth);
  recipe.defaults = recipe.defaults || {};
  recipe.defaults.serviceURL =
      process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/';
  recipe.actions = recipe.actions || [];
  var fixAction = function(action) {
    action.action = action.action.replace(/Action$/, '');
    if (action.service) action.action += action.service.charAt(0).toUpperCase() + action.service.substring(1);
  };
  recipe.actions.forEach(fixAction);
  recipe.pages.forEach(function(page) {
    if (page.actions) page.actions.forEach(fixAction);
  })
});

for (name in Recipes) {
  var recipe = Recipes[name];
  recipe.related_recipes = (recipe.related_recipes || []).map(function(relatedName) {
    var related = Recipes[relatedName];
    if (!related) throw new Error("Related recipe " + relatedName + " not found");
    return {
      name: related.name,
      title: related.title,
      description: related.description,
      icon: related.icon,
    }
  });
}
