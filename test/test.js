var _ = require('lodash');
var fs = require('fs');
var expect = require('chai').expect;

var CodeTemplate = require('../code_templates');

describe('Sample Code', function() {
  var renderParams = null;
  before(function(done) {
    require('../code_templates/params.js')(function(params) {
      renderParams = params;
      done();
    });
  });

  var testCases = [{
    name: 'simple',
    service: 'media',
    action: 'list',
    params: {
      answers: {},
      showSetup: false,
    },
  }]

  testCases.forEach(function(testCase) {
    CodeTemplate.LANGUAGES.forEach(function(l) {
      it('should generate for ' + l, function() {
        var tmpl = new CodeTemplate({language: l});
        params = _.extend(testCase.params, renderParams[testCase.service][testCase.action]);
        var code = tmpl.render(params);
        var ext = CodeTemplate.LANGUAGE_DETAILS[l].ext;
        fs.writeFileSync(__dirname + '/golden/' + testCase.name + '/' + l + '.' + ext, code);
      });
    });
  });
})
