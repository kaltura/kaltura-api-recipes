var Async = require('async');
var Spawn = require('child_process').spawn;
var Util = require('util');
var FS = require('fs');
var Path = require('path');
var Request = require('request');
var Mkdirp = require('mkdirp');
var Rmdir = require('rimraf')
var Expect = require('chai').expect;

var Server = require('./server.js');

var PORT = 3334;
var BASE_URL = 'http://127.0.0.1:' + PORT + '/recipes';

var PROCESS_WAIT_TIME = 500;

var GOLDEN_BASE = __dirname + '/golden';

var AUTH_ANSWERS = {
  partnerId: parseInt(process.env.KALTURA_PARTNER_ID) || 1760921,
  secret: process.env.KALTURA_SECRET || process.env.KALTURA_ADMIN_SECRET || '8d6cb692ab0f41bfa6bde373204c4b40',
  serviceURL: process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/',
  userId: process.env.KALTURA_USER_ID || 'lucybot@example.com',
  sessionType: process.env.KALTURA_SECRET ? 0 : 2
}

var buildCode = function(recipe, data, done) {
  data.answers = data.answers || {};
  Util._extend(data.answers, AUTH_ANSWERS);
  Request.post({
    url: BASE_URL + Path.join('/', recipe, 'code'),
    json: true,
    body: data,
  }, function(err, resp, files) {
    Expect(err).to.equal(null);
    Expect(files).to.be.instanceof(Array);
    var baseDir = Path.join(GOLDEN_BASE, data.language, recipe, 'p' + data.page);
    if (process.env.WRITE_GOLDEN) {
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
    } else {
      files.filter(function(f) {return !f.directory}).forEach(function(file) {
        var golden = FS.readFileSync(Path.join(baseDir, file.filename), 'utf8')
        Expect(golden).to.equal(file.contents)
      })
    }
    done();
  });
}

var Recipes = require('../recipes/recipes.js');
var ANSWERS = {
  analytics: {
    reportType: "5",
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
var LANGUAGES = ['php', 'javascript', 'node'];

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
});

var startServer = function(language, directory) {
  if (language == 'php' || language === 'javascript') {
    proc = Spawn('php', ('-S 0.0.0.0:3333 -t ' + directory).split(' '), {stdio: 'pipe'});
  } else if (language === 'node') {
    proc = Spawn('node', [Path.join(directory, 'server.js')], {stdio: 'pipe'});
  }
  proc.stderr.on('data', function(err) {
    if (err.toString().match(/\[200\]: \//)) return;
    console.log('    ERROR:', err.toString());
    Expect(err).to.equal(null);
  })
  return proc;
} 

Object.keys(Recipes).forEach(function(recipe) {
  if (Recipes[recipe].broken) return;
  LANGUAGES.forEach(function(language) {
    Recipes[recipe].pages.forEach(function(page, pageIndex) {
      describe('server for ' + recipe + ' p' + pageIndex + ' in ' + language, function(done) {
        var proc;
        before(function(done) {
          proc = startServer(language, Path.join(__dirname, 'golden', language, recipe, 'p' + pageIndex));
          setTimeout(done, PROCESS_WAIT_TIME);
        });
        after(function(done) {
          proc.kill('SIGHUP');
          setTimeout(done, PROCESS_WAIT_TIME);
        })
        it ('should return HTML', function(done) {
          Request('http://127.0.0.1:3333/', function(err, resp, body) {
            Expect(err).to.equal(null);
            var goldenDir = Path.join(__dirname, 'golden', 'responses', language, recipe, 'p' + pageIndex);
            var goldenFile = Path.join(goldenDir, 'response.html');
            if (process.env.WRITE_GOLDEN) {
              if (!FS.existsSync(goldenDir)) Mkdirp.sync(goldenDir);
              FS.writeFileSync(goldenFile, body);
            } else {
              golden = FS.readFileSync(goldenFile, 'utf8');
              Expect(golden).to.equal(body);
            }
            done();
          });
        })
      });
    });
  });
})
