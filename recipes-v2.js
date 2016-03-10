var fs = require('fs');
var _ = require('lodash');

var recipes = module.exports = {};

var DIR = __dirname + '/recipes-v2';

var XSD_DATA = fs.readFileSync(DIR + '/extras/metadata_profile_sample.xsd', 'utf8');

fs.readdirSync(DIR).forEach(function(r) {
  var filename = DIR + '/' + r;
  if (fs.statSync(filename).isDirectory()) return;
  var name = r.match(/^(.*)\./)[1];
  var recipe = recipes[name] = require(filename);
  recipe.defaults = recipe.defaults || {};
  recipe.defaults.serviceURL =
      process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/';
  recipe.defaults.recipeName = recipe.name;

  var opsUsed = [];
  recipe.steps.forEach(function(step) {
    if (!step.apiCall) return;
    var match = step.apiCall.path.match(/\/service\/(.*)\/action\/(.*)$/);
    opsUsed.push({service: match[1], action: match[2]});
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
      var docUrl = '/console#/Documentation' + url;
      var conUrl = '/console#/Console' + url;
      return '* `' + op.service + '.' + op.action +
          '` - [Documentation](' + docUrl + '), [Test Console](' + conUrl + ')';
    })).join('\n');
  }

  if (recipe.name === 'metadata') recipe.defaults.xsdData = XSD_DATA;
})
