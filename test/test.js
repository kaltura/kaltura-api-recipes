var Util = require('util');
var FS = require('fs');
var Path = require('path');
var Request = require('request');
var Mkdirp = require('mkdirp');

var Server = require('./server.js');

var PORT = 3333;
var BASE_URL = 'http://127.0.0.1:' + PORT + '/recipes';

var GOLDEN_BASE = __dirname + '/golden';

var AUTH_ANSWERS = {
  partnerId: 1760921,
  adminSecret: '8d6cb692ab0f41bfa6bde373204c4b40',
}

var buildCode = function(recipe, data, done) {
  data.answers = data.answers || {};
  Util._extend(data.answers, AUTH_ANSWERS);
  Request.post({
    url: BASE_URL + Path.join('/', recipe, 'code'),
    json: true,
    body: data,
  }, function(err, resp, files) {
    if (err) throw err;
    var baseDir = Path.join(GOLDEN_BASE, data.language, recipe);
    if (!FS.existsSync(baseDir)) FS.mkdirSync(baseDir);
    var dirs = files.filter(function(f) {return f.directory});
    files = files.filter(function(f) {return !f.directory});
    dirs.forEach(function(dir) {
      var filename = Path.join(baseDir, dir.filename);
      if (!FS.existsSync(filename)) Mkdirp.sync(filename);
    })
    files.forEach(function(file) {
      FS.writeFileSync(Path.join(baseDir, file.filename), file.contents);
    });
    done();
  });
}

var Recipes = require('../recipes/recipes.js');
var ANSWERS = {
  analytics: {
    reportType: 5,
    fromDay: '2015-07-01',
    toDay: '2015-07-10',
  },
  captions: {
    entryId: '1_318vzqcr',
    uiConf: 24666901,
  },
  code_cue_points: {
    entryIdEqual: '1_318vzqcr',
    uiConf: 28959921,
  },
  ad_cue_points: {
    entryIdEqual: '1_318vzqcr',
    uiConf: 28959921,
  },
  dynamic_thumbnails: {
    uiConf: 28959921,
  },
  upload: {
    uiConf: 28959921,
  }
}
var LANGUAGES = ['php', 'javascript', 'node']

for (recipeName in Recipes) {
  var recipe = Recipes[recipeName];
  ANSWERS[recipeName] = ANSWERS[recipeName] || {};
  recipe.control_sets.forEach(function(set) {
    var inputs = set.inputs || [];
    inputs.forEach(function(input) {
      if (input.default && !ANSWERS[recipeName][input.name]) {
        ANSWERS[recipeName][input.name] = input.default;
      }
    })
  })
}

describe('sample code', function() {
  before(function(done) {
    Server.listen(PORT);
    done();
  });

  Object.keys(Recipes).forEach(function(recipe) {
    if (!Recipes[recipe].broken) {
      var answers = ANSWERS[recipe];
      LANGUAGES.forEach(function(language) {
        it('should build ' + recipe + ' recipe for ' + language, function(done) {
          buildCode(recipe, {language: language, answers: answers}, done);
        });
      });
    }
  });
})
