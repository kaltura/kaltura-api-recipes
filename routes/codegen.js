var _ = require('lodash');
var FS = require('fs');
var Router = require('express').Router();
var Lucy = require('lucy-codegen').Lucy;
var KCode = require('kaltura-codegen'),
    CodeTemplates = KCode.templates;
var CodeTemplate = require('../codegen');

module.exports = {};
module.exports.initialize = function(cb) {
  require('../codegen/params')(function(renderParams) {
    var LANGS = [
      {name: 'php'},
      {name: 'javascript'},
      {name: 'node'},
      {name: 'ruby'},
    ]
    LANGS.forEach(function(l) {
      l.template = new CodeTemplate({language: l.name})
    })

    Router.post('/code/build/request', function(req, res) {
      var lang = LANGS.filter(l => l.name === req.body.language)[0];
      if (!lang) return res.status(500).send("Unknown language " + req.body.language);
      if (process.env.DEVELOPMENT) lang.template.reload();
      var path = req.body.request.path;
      var parts = path.match(/service\/(\w+)\/action\/(\w+)$/);
      var service = parts[1], action = parts[2];
      var codeParams = _.extend({answers: req.body.answers, showSetup: req.body.showSetup}, renderParams[service][action]);
      res.json({code: lang.template.render(codeParams)});
    })
    cb(Router);
  });
}
