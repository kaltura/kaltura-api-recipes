var fs = require('fs');

var V1_DIR = __dirname + '/../recipes'
var V2_DIR = __dirname + '/../recipes-v2'

fs.readdirSync(V1_DIR).forEach(function(r) {
  if (r === 'recipes.js') return;
  if (fs.statSync(V1_DIR + '/' + r).isDirectory()) return;
  var recipe = require(V1_DIR + '/' + r);
  var newRecipe = convertRecipe(recipe)
  fs.writeFileSync(V2_DIR + '/' + r.replace(/\.js$/, '.json'), JSON.stringify(newRecipe, null, 2))
})

function convertRecipe(recipe) {
  var newRecipe = {};

  newRecipe.name = recipe.name;
  newRecipe.summary = recipe.description;
  newRecipe.description = recipe.tip;
  newRecipe.relatedRecipes = recipe.related_recipes;
  newRecipe.icon = recipe.icon;
  newRecipe.tags = recipe.tags;
  newRecipe.keywords = recipe.keywords;
  newRecipe.steps = recipe.recipe_steps.map(convertStep);

  return newRecipe;
}

function convertStep(step) {
  var newStep = {};

  newStep.title = step.title;
  newStep.description = step.tip;
  newStep.parameters = step.inputs.map(convertInput);

  return newStep;
}

function convertInput(input) {
  var newInput = JSON.parse(JSON.stringify(input));
  delete newInput.choices;
  delete newInput.dynamic_choices;
  newInput.enum = input.choices;
  newInput.dynamicEnum = input.dynamic_choices;
  return newInput;
}
