var Async = require('async');
var Util = require('util');
var FS = require('fs');
var Path = require('path');
var Request = require('request');
var Mkdirp = require('mkdirp');
var Rmdir = require('rimraf')

var Server = require('./server.js');

var PORT = 3333;
var BASE_URL = 'http://127.0.0.1:' + PORT + '/recipes';

var GOLDEN_BASE = __dirname + '/golden';

var AUTH_ANSWERS = {
  partnerId: 1760921,
  secret: '8d6cb692ab0f41bfa6bde373204c4b40',
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
    var baseDir = Path.join(GOLDEN_BASE, data.language, recipe, 'p' + data.page);
    if (FS.existsSync(baseDir)) Rmdir.sync(baseDir);
    Mkdirp.sync(baseDir);
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
    entryId: '1_9kdmnhuv',
    uiConf: 30633631,
  },
  code_cue_points: {
    entryIdEqual: '1_318vzqcr',
    uiConf: 30633631,
  },
  ad_cue_points: {
    entryIdEqual: '1_318vzqcr',
    uiConf: 30633631,
  },
  dynamic_thumbnails: {
    uiConf: 30633631,
  },
  video_search: {
    uiConf: 30633631,
  },
  upload: {
    uiConf: 30633631,
  },
}
var LANGUAGES = ['php', 'javascript', 'node']

for (recipeName in Recipes) {
  var recipe = Recipes[recipeName];
  ANSWERS[recipeName] = ANSWERS[recipeName] || {};
  ANSWERS[recipeName].libraryDirectory = '../../lib/';
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
    if (Recipes[recipe].broken) return;
    var answers = ANSWERS[recipe];
    LANGUAGES.forEach(function(language) {
      it('should build ' + recipe + ' recipe for ' + language, function(done) {
        Async.parallel(Recipes[recipe].pages.map(function(page, pageIndex) {
          return function(callback) {
            buildCode(recipe, {language: language, answers: answers, page: pageIndex}, callback);
          }
        }), done);
      });
    });
  });
})
