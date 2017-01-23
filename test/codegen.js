var _ = require('lodash');
var fs = require('fs');
var expect = require('chai').expect;

var swagger = require('../swagger/swagger.js');
var CodeTemplate = require('../codegen');

describe('Sample Code', function() {
  this.timeout(5000);

  var testCases = [{
    name: 'simple',
    service: 'media',
    action: 'list',
    input: {
      answers: {},
      showSetup: false,
    },
  }, {
    name: 'start_session',
    service: 'session',
    action: 'start',
    input: {
      answers: {},
    },
  }, {
    name: 'add_captions',
    service: 'caption_captionasset',
    action: 'add',
    input: {
      answers: {
        tags: 'stuff',
        language: "Arabic",
      }
    }
  }, {
    name: 'with_plugin',
    service: 'metadata_metadataprofile',
    action: 'list',
    input: {
      showSetup: true,
    },
  }, {
    name: 'with_setup',
    service: 'media',
    action: 'list',
    input: {
      answers: {},
      showSetup: true,
    }
  }, {
    name: 'enum',
    service: 'session',
    action: 'start',
    input: {
      answers: {
        type: 0,
      },
      showSetup: false,
    },
  }, {
    name: 'with_arguments',
    service: 'media',
    action: 'list',
    input: {
      answers: {
        'filter[nameLike]': 'foobar',
        'filter[statusEqual]': '2',
        'filter[advancedSearch][objectType]': 'KalturaAttributeCondition',
        'filter[advancedSearch][value]': 'baz',
        'pager[pageSize]': 3,
      },
      showSetup: false,
    }
  }, {
    name: 'primitive_argument',
    service: 'media',
    action: 'get',
    input: {
      answers: {
        'entryId': 'abcde',
      },
      showSetup: false,
    }
  }]

  testCases.forEach(function(testCase) {
    CodeTemplate.LANGUAGES.forEach(function(l) {
      it('should generate for ' + l, function() {
        var tmpl = new CodeTemplate({language: l, swagger: swagger});
        testCase.input.answers = testCase.input.answers || {};
        testCase.input.showSetup = testCase.input.showSetup || false;
        testCase.input.path = '/service/' + testCase.service + '/action/' + testCase.action;
        testCase.input.method = 'get';
        testCase.input.service = testCase.service;
        testCase.input.action = testCase.action;
        var code = tmpl.render(testCase.input);
        var ext = CodeTemplate.LANGUAGE_DETAILS[l].ext;
        var dir = __dirname + '/golden/' + testCase.name;
        try {fs.mkdirSync(dir)} catch(e) {}
        fs.writeFileSync(dir + '/' + l + '.' + ext, code);
      });
    });
  });
})
