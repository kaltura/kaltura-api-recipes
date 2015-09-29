var Async = require('async');
var Proc = require('child_process');
var Util = require('util');
var FS = require('fs');
var Path = require('path');
var Request = require('request');
var Mkdirp = require('mkdirp');
var Rmdir = require('rimraf')
var Expect = require('chai').expect;

var Languages = require('lucy-codegen').languages;

var Server = require('./server.js');

var PORT = process.env.TEST_SERVER_PORT || 3334;
var BASE_URL = 'http://127.0.0.1:' + PORT + '/recipes';

var MIN_TIMEOUT = 5000;
var PROCESS_WAIT_TIME = parseInt(process.env.TEST_WAIT_TIME) || 2000;

var GOLDEN_BASE = __dirname + '/golden';

var AUTH_ANSWERS = {
  partnerId: parseInt(process.env.KALTURA_PARTNER_ID) || 1760921,
  secret: process.env.KALTURA_SECRET || process.env.KALTURA_ADMIN_SECRET || '8d6cb692ab0f41bfa6bde373204c4b40',
  serviceURL: process.env.KALTURA_SERVICE_URL || 'https://www.kaltura.com/',
  userId: process.env.KALTURA_USER_ID || 'lucybot@example.com',
  sessionType: process.env.KALTURA_SECRET ? 0 : 2
}

var ANSWERS = process.env.KALTURA_ANSWERS_FILE ?
    JSON.parse(FS.readFileSync(process.env.KALTURA_ANSWERS_FILE, 'utf8'))
    : {
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
        metadata: {
          name: 'foo',
          systemName: 'bar'
        }
      }

var LANGUAGES = ['php', 'javascript', 'node', 'ruby'];

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
        Expect(file.contents).to.equal(golden)
      })
    }
    done();
  });
}

var Recipes = require('../recipes/recipes.js');

for (recipeName in Recipes) {
  var recipe = Recipes[recipeName];
  ANSWERS[recipeName] = ANSWERS[recipeName] || {};
  ANSWERS[recipeName].libraryDirectory = '../../lib/';
  recipe.recipe_steps.forEach(function(set) {
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

if (process.env.SKIP_RESPONSES) return;

var startServer = function(language, directory, started) {
  var serverOpts = {
    port: 3333,
    directory: directory,
  };
  var procArgs = {
    stdio: 'pipe',
    cwd: directory,
  };
  var proc = null;
  var cmd = Languages[language].app.startServer(serverOpts);
  var args = cmd.substring(cmd.indexOf(' ') + 1).split(' ');
  cmd = cmd.substring(0, cmd.indexOf(' '));
  if (language === 'ruby') {
    var bin = Path.join(directory, 'bin/rails');
    FS.chmodSync(bin, '777');
    FS.writeFileSync(Path.join(directory, 'Gemfile.lock'),
                     FS.readFileSync(Path.join(__dirname, 'golden/ruby/Gemfile.lock'), 'utf8'))
    proc = Proc.spawn(cmd, args, procArgs);
    proc.stderr.on('data', function(data) {
      data = data.toString();
      if (data.indexOf('HTTPServer#start') !== -1) {
        started(proc);
      }
    })
  } else {
    proc = Proc.spawn(cmd, args, procArgs);
    setTimeout(function() {started(proc)}, PROCESS_WAIT_TIME);
  }
  proc.stdout.on('data', function(data) {
    console.log('      ' + data.toString());
  });
  proc.stderr.on('data', function(err) {
    console.log('      ' + err.toString());
  });
  proc.on('error', function(err) {
    Expect(err).to.equal(null);
  });
}

var killServer = function(language, proc, killed) {
  proc.kill('SIGKILL');
  setTimeout(killed, PROCESS_WAIT_TIME);
}

Object.keys(Recipes).forEach(function(recipe) {
  if (Recipes[recipe].broken) return;
  LANGUAGES.forEach(function(language) {
    Recipes[recipe].pages.forEach(function(page, pageIndex) {
      describe('server for ' + recipe + ' p' + pageIndex + ' in ' + language, function(done) {
        var proc = null;
        before(function(done) {
          this.timeout(Math.max(MIN_TIMEOUT, PROCESS_WAIT_TIME + 1000));
          startServer(language, Path.join(__dirname, 'golden', language, recipe, 'p' + pageIndex), function(server) {
            proc = server;
            done();
          });
        });
        after(function(done) {
          this.timeout(Math.max(MIN_TIMEOUT, PROCESS_WAIT_TIME + 1000));
          if (!proc) throw new Error("server never started");
          killServer(language, proc, done);
        })
        it ('should return HTML', function(done) {
          this.timeout(MIN_TIMEOUT);
          Request('http://127.0.0.1:3333/', function(err, resp, body) {
            Expect(err).to.equal(null);
            var goldenDir = Path.join(__dirname, 'golden', 'responses', language, recipe, 'p' + pageIndex);
            var goldenFile = Path.join(goldenDir, 'response.html');
            if (process.env.WRITE_GOLDEN) {
              if (!FS.existsSync(goldenDir)) Mkdirp.sync(goldenDir);
              FS.writeFileSync(goldenFile, body);
            } else {
              golden = FS.readFileSync(goldenFile, 'utf8');
              Expect(body).to.equal(golden);
            }
            done();
          });
        })
      });
    });
  });
})
