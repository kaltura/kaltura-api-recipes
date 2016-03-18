var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = {};
var recipes = module.exports.recipes = {};

var DIR = __dirname + '/recipes-v2';
module.exports.save = function(name, recipe, callback) {
  name = path.join('/', name);
  name = path.join(DIR, name + '.json');
  fs.writeFile(name, JSON.stringify(recipe, null, 2), function(err) {
    if (!err && process.env.DEVELOPMENT) module.exports.reload();
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
      recipe.description += '\n\nThis recipe uses the following operations:\n' + opsUsed.map(function(op) {
        return '* ' + op.service + '.' + op.action;
      }).join('\n');

      recipe.finishText = [
        '### Learn More',
        'You can learn more about the services and actions used in this recipe by visiting the [API Console](/console)',
        '',
      ].concat(opsUsed.map(function(op) {
        var url = '/service/' + op.service + '/action/' + op.action;
        url = '/GET' + url;
        var docUrl = '/portal/console#/Documentation' + url;
        var conUrl = '/portal/console#/Console' + url;
        return '* `' + op.service + '.' + op.action +
            '` - [Documentation](' + docUrl + '), [Test Console](' + conUrl + ')';
      })).join('\n');
    }

    if (recipe.name === 'metadata') recipe.defaults.xsdData = XSD_DATA;
  })
}
module.exports.reload();
