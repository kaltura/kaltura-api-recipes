var RecipeManager = module.exports = {};
var Recipes = RecipeManager.recipes = {};

var FS = require('fs');
var Path = require('path');
var RemoveMarkdown = require('remove-markdown');

var AuthStep = require('./includes/auth.js');

var files = FS.readdirSync(__dirname);
var thisFile = Path.basename(__filename);

var XSD_DATA = FS.readFileSync(__dirname + '/data/metadata_profile_sample.xsd', 'utf8');

RecipeManager.save = function(recipeName, newRecipe, callback) {
  newRecipe.recipe_steps.shift();
  var filename = Path.join(__dirname, newRecipe.name + '.json');
  FS.readFile(filename, 'utf8', function(err, contents) {
    if (err) return callback(err);
    var oldRecipe = JSON.parse(contents);
    oldRecipe.recipe_steps = newRecipe.recipe_steps;
    oldRecipe.title = newRecipe.title;
    oldRecipe.description = newRecipe.description;
    FS.writeFile(filename, JSON.stringify(oldRecipe, null, 2), function(err) {
      if (err) return callback(err);
      RecipeManager.setRecipeDefaults(oldRecipe);
      RecipeManager.addRelatedRecipes(oldRecipe);
      Recipes[recipeName] = oldRecipe;
      callback();
    });
  })
}

RecipeManager.setRecipeDefaults = function(recipe) {
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

  if (recipe.name === 'metadata') {
    recipe.recipe_steps.forEach(function(step) {
      step.inputs.forEach(function(input) {
        if (input.name === 'xsdData') input.default = XSD_DATA;
      })
    })
  }
  recipe.tip = recipe.recipe_steps[1].tip || '';
  if (Array.isArray(recipe.tip)) recipe.tip = recipe.tip.join('\n\n');
  recipe.tip = RemoveMarkdown(recipe.tip);
}

RecipeManager.addRelatedRecipes = function(recipe) {
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

files.forEach(function(filename) {
  if (filename === thisFile) return;
  filename = Path.join(__dirname, filename);
  if (FS.statSync(filename).isDirectory()) return;
  var ext = Path.extname(filename);
  var name = Path.basename(filename, ext);
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
  if (Recipes[name].hidden) delete Recipes[name];
  else RecipeManager.setRecipeDefaults(Recipes[name]);
});

for (name in Recipes) {
  RecipeManager.addRelatedRecipes(Recipes[name]);
}

