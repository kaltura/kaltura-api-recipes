var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var swagger = require('./swagger/swagger.js');

module.exports = {};
var recipes = module.exports.recipes = {};

var SAVE_MESSAGE = "Thanks for contributing! We've opened a pull request on GitHub here: https://github.com/kaltura/kaltura-api-recipes";
var DESC_PREFIX = 'This recipe uses the following operations';

function stripConstant(recipe, field, prefix) {
  recipe[field] = recipe[field] || '';
  var idx = recipe[field].indexOf(prefix);
  if (idx !== -1) recipe[field] = recipe[field].substring(0, idx);
  if (!recipe[field].length) delete recipe[field];
  else recipe[field] = recipe[field].split('\n\n');
}

function prepForSave(recipe) {
  stripConstant(recipe, 'description', DESC_PREFIX);
  if (recipe.defaults) {
    delete recipe.defaults.serviceURL;
    delete recipe.defaults.format;
    delete recipe.defaults.recipeName;
    if (!Object.keys(recipe.defaults).length) delete recipe.defaults;
  }
  recipe.steps.forEach(function(s) {
    s.description = s.description || '';
    if (!s.description.length) delete s.description;
    else s.description = s.description.split('\n\n');
  });
}

var DIR = __dirname + '/recipes-v2';
module.exports.save = function(name, recipe, callback) {
  if (!process.env.ENABLE_EDITS) {
    callback("Editing is not enabled on this server.");
  } else {
    prepForSave(recipe);
    var filename = path.join('/', name);
    filename = path.join(DIR, filename + '.json');
    fs.writeFile(filename, JSON.stringify(recipe, null, 2), function(err) {
      if (!err) module.exports.reload();
      callback(err, "Recipe saved to disk.");
    });
  }
}

var XSD_DATA = fs.readFileSync(DIR + '/extras/metadata_profile_sample.xsd', 'utf8');

module.exports.reload = function() {
  fs.readdirSync(DIR).forEach(function(r) {
    var filename = DIR + '/' + r;
    if (fs.statSync(filename).isDirectory()) return;
    var name = r.match(/^(.*)\./)[1];
    var recipe = recipes[name] = JSON.parse(fs.readFileSync(filename, 'utf8'));
    recipe.defaults = recipe.defaults || {};
    recipe.defaults.serviceURL =
        process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/';
    recipe.defaults.recipeName = recipe.name;
    recipe.defaults.format = 1;

    var opsUsed = [];
    recipe.steps.forEach(function(step) {
      if (!step.apiCall) return;
      var op = swagger.paths[step.apiCall.path][step.apiCall.method];
      if (!op) throw new Error("In recipe " + recipe.name + " no operation " + step.apiCall.method + " " + step.apiCall.path);
      var opId = op.operationId;
      var match = step.apiCall.path.match(/\/service\/(.*)\/action\/(.*)$/);
      opsUsed.push({service: match[1], action: match[2], tag: opId.substring(0, opId.indexOf('.'))});
      if (!step.parameters) step.ignoreParameters = ['format'];
    })
    opsUsed = _.uniqWith(opsUsed, _.isEqual);
    if (opsUsed.length) {
      recipe.description = recipe.description || '';
      if (recipe.description) recipe.description += '\n\n';
      recipe.description += DESC_PREFIX + '\n\n' + opsUsed.map(function(op) {
        return '* ' + op.service + '.' + op.action;
      }).join('\n');

      recipe.tags = recipe.tags || [];
      recipe.tags = recipe.tags.concat(opsUsed.map(function(op) {
        return op.tag;
      }))
      recipe.tags = _.uniq(recipe.tags);
    }

    if (recipe.name === 'metadata') {
      recipe.steps[0].parameters.filter(p => p.name === 'xsdData').forEach(p => p.default = XSD_DATA);
    }
  })
}
module.exports.reload();
