var RecipeManager = module.exports = function(opts, callback) {
  var self = this;
  opts = opts || {};
  self.schema = opts.schema;
  self.recipes = {};
  files.forEach(function(filename) {
    if (filename === thisFile) return;
    filename = Path.join(__dirname, filename);
    if (FS.statSync(filename).isDirectory()) return;
    var ext = Path.extname(filename);
    var name = Path.basename(filename, ext);
    try {
      if (ext === '.json') {
        self.recipes[name] = JSON.parse(FS.readFileSync(filename, 'utf8'));
      } else if (ext === '.js') {
        self.recipes[name] = JSON.parse(JSON.stringify(require(filename)));
      }
    } catch (e) {
      console.log('Error parsing recipe ' + name);
      throw e;
    }
    self.recipes[name].name = name;
    self.setRecipeDefaults(self.recipes[name]);
  });

  for (name in self.recipes) {
    self.addRelatedRecipes(self.recipes[name]);
  }
};

var FS = require('fs');
var Path = require('path');
var RemoveMarkdown = require('remove-markdown');

var AuthStep = require('./includes/auth.js');

var files = FS.readdirSync(__dirname);
var thisFile = Path.basename(__filename);

var XSD_DATA = FS.readFileSync(__dirname + '/data/metadata_profile_sample.xsd', 'utf8');

RecipeManager.prototype.save = function(recipeName, newRecipe, callback) {
  var self = this;
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
      self.setRecipeDefaults(oldRecipe);
      self.addRelatedRecipes(oldRecipe);
      self.recipes[recipeName] = oldRecipe;
      callback();
    });
  })
}

RecipeManager.prototype.setRecipeDefaults = function(recipe) {
  var self = this;
  var auth = recipe.needs_admin ? AuthStep.admin : AuthStep.sessionSelect;
  recipe.recipe_steps.unshift(auth);
  recipe.defaults = recipe.defaults || {};
  recipe.defaults.serviceURL =
      process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/';
  recipe.defaults.recipeName = recipe.name;

  recipe.actions = recipe.actions || [];
  var allActions = [].concat(recipe.actions);
  recipe.pages.forEach(function(p) {
    if (p.actions) allActions = allActions.concat(p.actions);
  })
  var consoleLinks = [];
  var addActionLinks = function(action) {
    if (action.service && self.schema && self.schema.services[action.service]) {
      consoleLinks.push({
        service: self.schema.services[action.service].id,
        action: action.action,
      })
    }
  }
  allActions.forEach(function(action) {
    if (action.action) action.action = action.action.replace(/Action$/, '');
  });
  allActions.forEach(addActionLinks);
  allActions.forEach(function(action) {
    if (action.service) {
      action.action += action.service.charAt(0).toUpperCase() + action.service.substring(1);
    }
  })
  allActions.forEach(function(a) {delete a.service})

  recipe.tip = recipe.tip || '';
  if (Array.isArray(recipe.tip)) recipe.tip = recipe.tip.join('\n\n');
  if (consoleLinks.length) {
    recipe.tip += '\n\nThis recipe uses the following operations:\n' + consoleLinks.map(function(link) {
      return '* ' + link.service + '.' + link.action;
    }).join('\n');
    recipe.finish_text = [
      '### Learn More',
      'You can learn more about the services and actions used in this recipe by visiting the [API Console](/console)',
      '',
    ].concat(consoleLinks.map(function(link) {
      var url = '/service/' + link.service + '/action/' + link.action;
      url = '/GET' + url;
      var docUrl = '/console#/Documentation' + url;
      var conUrl = '/console#/Console' + url;
      return '* `' + link.service + '.' + link.action +
          '` - [Documentation](' + docUrl + '), [Test Console](' + conUrl + ')';
    })).join('\n');
  }
  recipe.console_links = consoleLinks.map(function(link) {
    return '/service/' + link.service + '/action/' + link.action;
  })

  if (recipe.name === 'metadata') {
    recipe.recipe_steps.forEach(function(step) {
      step.inputs.forEach(function(input) {
        if (input.name === 'xsdData') input.default = XSD_DATA;
      })
    })
  }
}

RecipeManager.prototype.addRelatedRecipes = function(recipe) {
  var self = this;
  recipe.related_recipes = (recipe.related_recipes || []).map(function(relatedName) {
    if (typeof relatedName !== 'string') return relatedName;
    var related = self.recipes[relatedName];
    if (!related) throw new Error("Related recipe " + relatedName + " not found");
    return {
      name: related.name,
      title: related.title,
      description: related.description,
      icon: related.icon,
    }
  });
}

