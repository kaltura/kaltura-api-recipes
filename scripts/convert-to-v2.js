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
  newRecipe.steps = recipe.recipe_steps.map(s => convertStep(s, recipe));

  return newRecipe;
}

function convertStep(step, recipe) {
  var newStep = {};

  newStep.title = step.title;
  newStep.description = step.tip;
  newStep.parameters = step.inputs.map(convertInput);
  var actions = recipe.actions || [];
  actions = actions.concat(step.actions || []);
  var page = recipe.pages[step.page || 0];
  if (page) {
    actions.unshift(page.data);
    actions = actions.concat(page.actions);
  }
  actions.filter(a => a && a.action).forEach(function(a) {
    var action = a.action.replace(/Action$/, '');
    var service = a.service;
    if (!service) {
      var match = action.match(/^(getTotal|getTable|listTemplates)(\w+)$/);
      if (!match) match = action.match(/^(get|list|add|clone)(\w+)$/);
      if (!match) return;
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
  if (!newStep.apiCall) {
    var fileBase = __dirname + '/../node_modules/kaltura-codegen/code_templates';
    var filesToCheck = [
      {language: 'html',       file: fileBase + '/views/all/'  +       step.code_snippet + '.html'},
      {language: 'node',       file: fileBase + '/views/node/' +       step.code_snippet + '.html'},
      {language: 'ruby',       file: fileBase + '/views/ruby/' +       step.code_snippet + '.html'},
      {language: 'php',        file: fileBase + '/views/php/'  +       step.code_snippet + '.html'},
      {language: 'javascript', file: fileBase + '/views/javascript/' + step.code_snippet + '.html'},
      {language: 'node',       file: fileBase + '/actions/node/' +       step.code_snippet + '.html'},
      {language: 'ruby',       file: fileBase + '/actions/ruby/' +       step.code_snippet + '.rb'},
      {language: 'php',        file: fileBase + '/actions/php/'  +       step.code_snippet + '.php'},
      {language: 'javascript', file: fileBase + '/actions/javascript/' + step.code_snippet + '.js'},
    ];
    filesToCheck.forEach(function(f) {
      if (fs.existsSync(f.file)) {
        newStep.codeSnippet = newStep.codeSnippet || {};
        newStep.codeSnippet[f.language] = fs.readFileSync(f.file, 'utf8');
      }
    })
  }
  if (!newStep.apiCall && !newStep.codeSnippet) console.log('no api call', recipe.name, step.code_snippet);

  return newStep;
}

function convertInput(input) {
  var newInput         = {};
  newInput.name        = input.name;
  newInput.label       = input.label;
  newInput.default     = input.default;
  newInput.hidden      = input.hidden;
  newInput.enum        = input.choices;
  newInput.dynamicEnum = input.dynamic_choices;
  return newInput;
}
