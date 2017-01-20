var _ = require('lodash');
var FS = require('fs');
var Router = require('express').Router();
var Lucy = require('lucy-codegen').Lucy;
var CodeTemplate = require('../codegen');
var swagger = require('../swagger/swagger.js');

module.exports = {};
module.exports.initialize = function(cb) {
  require('../codegen/params')(function(renderParams) {
    const codeTemplates = CodeTemplate.LANGUAGES.map(function(l) {
      return {
        name: l,
        template: new CodeTemplate({language: l}),
      };
    })

    Router.post('/code/build/request', function(req, res) {
      var lang = codeTemplates.filter(l => l.name === req.body.language)[0];
      if (!lang) return res.status(500).send("Unknown language " + req.body.language);
      if (process.env.DEVELOPMENT) lang.template.reload();
      var path = req.body.request.path;
      var parts = path.match(/service\/(\w+)\/action\/(\w+)$/);
      var service = parts[1], action = parts[2];
      var operation = swagger.paths[path][req.body.request.method];
      var codeParams = {
        service,
        action,
        operation,
        parameters: operation.parameters.filter(p => p.name !== 'format' && p.name.indexOf('[') === 0),
        answers: req.body.answers,
        showSetup: req.body.showSetup,
      }
      res.json({code: lang.template.render(codeParams)});
    })
    cb(Router);
  });
}
