var Router = module.exports = require('express').Router();
var CodeBuilder = require('../lucy-langs/builders/builders.js').Recipe;

var EJS = require('ejs');
var FS = require('fs');
var Path = require('path');
var XMLParser = require('xml2js').parseString;

var Recipes = require('../recipes/recipes.js');

var CodeTemplates = require('../code_templates/code-templates.js');
var SchemaXML = FS.readFileSync(Path.join(__dirname, '../api_schema.xml'), 'utf8');
var Schema = null;
XMLParser(SchemaXML, function(err, result) {
  if (err) throw err;
  result = result.xml;
  Schema = {classes: {}, services: {}};

  result.services[0].service.forEach(function(service) {
    var serviceJS = Schema.services[service.$.name] = {actions: {}};
    var actions = service.action;
    actions.forEach(function(action) {
      var actionJS = serviceJS.actions[action.$.name] = {parameters: {}};
      if (!action.param) return;
      action.param.forEach(function(param) {
        var paramJS = actionJS[param.$.name] = {type: param.$.type};
      });
    });
  });

  result.classes[0].class.forEach(function(cls) {
    var classJS = Schema.classes[cls.$.name] = {properties: {}};
    var props = cls.property || [];
    props.forEach(function(prop) {
      var propJS = classJS.properties[prop.$.name] = {};
      if (prop.$.type.indexOf('Kaltura') === 0) {
        propJS.$ref = '#/classes/' + prop.$.type;
      } else {
        propJS.type = prop.$.type;
      }
    });
  });
});

Router.use(require('body-parser').json());

Router.use(function(req, res, next) {
  if (!Schema) return res.status(500).send('Schema not ready');
  else next();
})

Router.use('/:recipe', function(req, res, next) {
  if (!Recipes[req.params.recipe]) return res.status(404).send('Recipe ' + req.params.recipe + ' not found.');
  else next();
})

Router.get('/:recipe', function(req, res) {
  res.render('recipe', {recipe: Recipes[req.params.recipe]});
});

Router.post('/:recipe/code', function(req, res) {
  var recipe = Recipes[req.params.recipe];
  var actions = recipe.actions;
  var views = recipe.views;
  CodeBuilder.fixAnswers(req.body.answers, function(err, answers) {
    if (err) return res.status(500).send('Error parsing answers');
    var buildParams = {answers: answers, actions: {}, views: {}};
    buildParams.main = recipe.pages[0];
    buildParams.action_language = 'php';
    buildParams.view_language = 'html-php';
    actions.forEach(function(action) {
      var codeParams = {objects: [], service: action.service, action: action.action}
      var actionSchema = Schema.services[action.service].actions[action.action];
      var rendered = EJS.render(CodeTemplates.actions.php, codeParams);
      buildParams.actions[action.action] = {php: rendered};
    });
    views.forEach(function(view) {
      buildParams.views[view] = {html: CodeTemplates.views[view]};
    });
    CodeBuilder.build(buildParams, function(err, files) {
      if (err) return res.status(500).send('Error building code');
      res.json(files);
    });
  });
});

Router.get('/:recipe/embed', function(req, res) {
  res.send('not impl');
});
