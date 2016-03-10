var fs = require('fs');
var schema = require('kaltura-schema');

var V1_DIR = __dirname + '/../recipes';
var V2_DIR = __dirname + '/../recipes-v2';

schema.initialize(function() {
  fs.readdirSync(V1_DIR).forEach(function(r) {
    if (r === 'recipes.js') return;
    if (fs.statSync(V1_DIR + '/' + r).isDirectory()) return;
    var recipe = require(V1_DIR + '/' + r);
    var newRecipe = convertRecipe(recipe)
    fs.writeFileSync(V2_DIR + '/' + r.replace(/\.js$/, '.json'), JSON.stringify(newRecipe, null, 2))
  })
})

function convertRecipe(recipe) {
  var newRecipe = {};

  newRecipe.name = recipe.name;
  newRecipe.title = recipe.title;
  newRecipe.summary = recipe.description;
  newRecipe.description = recipe.tip;
  newRecipe.relatedRecipes = recipe.related_recipes;
  newRecipe.icon = recipe.icon;
  newRecipe.tags = recipe.tags;
  newRecipe.keywords = recipe.keywords;
  newRecipe.steps = recipe.recipe_steps.map(r => convertStep(r, recipe.actions));

  return newRecipe;
}

function convertStep(step, actions) {
  var newStep = {};

  newStep.title = step.title;
  newStep.description = step.tip;
  newStep.parameters = step.inputs.map(convertInput);

  (actions || []).forEach(function(a) {
    var action = a.action.replace(/Action$/, '');
    var service = a.service;
    if (!service) {
      var match = action.match(/^(get|list|add|clone)(\w+)$/);
      if (!match) return console.log('no match for action', action)
      action = match[1];
      service = match[2].charAt(0).toLowerCase() + match[2].substring(1);
    }
    var comboName = action + service.charAt(0).toUpperCase() + service.substring(1);
    if (step.code_snippet === comboName) {
      service = schema.services[service].id;
      newStep.apiCall = {
        path: '/service/' + service + '/action/' + action,
        method: 'get',
      }
    }
  })

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
