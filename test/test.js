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

describe('sample code', function() {
  before(function(done) {
    Server.listen(PORT);
    done();
  });

  it('should build authentication recipe', function(done) {
    buildCode('authentication', {language: 'php'}, done);
  })
})
