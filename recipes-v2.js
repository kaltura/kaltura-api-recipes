var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = {};
var recipes = module.exports.recipes = {};

var DESC_PREFIX = 'This recipe uses the following operations';
var LEARN_MORE_PREFIX = [
  '### Learn More',
  'You can learn more about the services and actions used in this recipe by visiting the [API Console](/console)',
  '',
].join('\n');

function stripConstant(recipe, field, prefix) {
  recipe[field] = recipe[field] || '';
  var idx = recipe[field].indexOf(prefix);
  if (idx !== -1) recipe[field] = recipe[field].substring(0, idx);
  if (!recipe[field].length) delete recipe[field];
  else recipe[field] = recipe[field].split('\n\n');
}

var DIR = __dirname + '/recipes-v2';
module.exports.save = function(name, recipe, callback) {
  name = path.join('/', name);
  name = path.join(DIR, name + '.json');
  stripConstant(recipe, 'description', DESC_PREFIX);
  if (recipe.defaults) {
    delete recipe.defaults.serviceURL;
    delete recipe.defaults.format;
    delete recipe.defaults.recipeName;
    if (!Object.keys(recipe.defaults).length) delete recipe.defaults;
  }
  stripConstant(recipe, 'finishText', LEARN_MORE_PREFIX);
  recipe.steps.forEach(function(s) {
    s.description = s.description || '';
    if (!s.description.length) delete s.description;
    else s.description = s.description.split('\n\n');
  })

  fs.writeFile(name, JSON.stringify(recipe, null, 2), function(err) {
    if (!err) module.exports.reload();
    callback(err);
  })
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
      var match = step.apiCall.path.match(/\/service\/(.*)\/action\/(.*)$/);
      opsUsed.push({service: match[1], action: match[2]});
      if (!step.parameters) step.ignoreParameters = ['format'];
    })
    opsUsed = _.uniqWith(opsUsed, _.isEqual);
    if (opsUsed.length) {
      recipe.description = recipe.description || '';
      if (recipe.description) recipe.description += '\n\n';
      recipe.description += DESC_PREFIX + '\n\n' + opsUsed.map(function(op) {
        return '* ' + op.service + '.' + op.action;
      }).join('\n');

      recipe.finishText = recipe.finishText || [LEARN_MORE_PREFIX].concat(opsUsed.map(function(op) {
        var url = '/service/' + op.service + '/action/' + op.action;
        url = '/GET' + url;
        var docUrl = '/portal/console#/Documentation' + url;
        var conUrl = '/portal/console#/Console' + url;
        return '* `' + op.service + '.' + op.action +
            '` - [Documentation](' + docUrl + '), [Test Console](' + conUrl + ')';
      })).join('\n');
    }

    if (recipe.name === 'metadata') {
      recipe.steps[0].parameters.filter(p => p.name === 'xsdData').forEach(p => p.default = XSD_DATA);
    }
  })
}
module.exports.reload();
