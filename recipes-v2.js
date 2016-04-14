var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var github = require('octonode').client(process.env.GITHUB_TOKEN);
var repo = github.repo('kaltura/kaltura-api-recipes');
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

var DIR = __dirname + '/recipes-v2';
module.exports.save = function(name, recipe, callback) {
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
  })
  if (!process.env.ENABLE_EDITS) {
    var path = 'recipes-v2/' + name + '.json';
    repo.contents(path, 'recipe-edits', function(err, file) {
      if (err) return callback(err);
      repo.updateContents(
          path,
          'Update Recipe ' + name,
          JSON.stringify(recipe, null, 2),
          file.sha,
          'recipe-edits',
          function(err) {
        repo.pr({
          title: 'Merge Recipe Edits',
          body: '',
          head: 'recipe-edits',
          base: 'development',
        }, function(err) {
          // ignore errors for existing PRs
          callback(null, SAVE_MESSAGE);
        });
      });
    });
  } else {
    var filename = path.join('/', name);
    filename = path.join(DIR, filename + '.json');
    fs.writeFile(filename, JSON.stringify(recipe, null, 2), function(err) {
      if (!err) module.exports.reload();
      callback(err, SAVE_MESSAGE);
    });
  }
}

module.exports.loadSaved = function(name, cb) {
  if (process.env.ENABLE_EDITS) {
    cb(null, recipes[name]);
  } else {
    repo.contents('recipes-v2/' + name + '.json', 'recipe-edits', function(err, file) {
      if (err) return cb(err);
      var content = new Buffer(file.content, 'base64').toString();
      cb(null, JSON.parse(content));
    })
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
      var opId = swagger.paths[step.apiCall.path][step.apiCall.method].operationId;
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
