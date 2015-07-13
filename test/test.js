var Util = require('util');
var FS = require('fs');
var Path = require('path');
var Request = require('request');

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
    if (!FS.existsSync(baseDir)) {
      FS.mkdirSync(baseDir);
    }
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
    uiConf: 28959921,
  },
  cue_points: {
    entryIdEqual: '1_318vzqcr',
    uiConf: 28959921,
  }
}
var LANGUAGES = ['php', 'javascript']

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
