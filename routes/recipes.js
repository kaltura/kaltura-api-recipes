var Router = module.exports = require('express').Router();
var CodeBuilders = require('../lucy-langs/builders/builders.js');

var Async = require('async');
var EJS = require('ejs');
var FS = require('fs');
var Path = require('path');
var XMLParser = require('xml2js').parseString;

var Recipes = require('../recipes/recipes.js');

var CodeTemplates = require('../code_templates/code-templates.js');
var SchemaXML = FS.readFileSync(Path.join(__dirname, '../api_schema.xml'), 'utf8');
var Schema = require('../api-schema.js');

var BLACKLISTED_FIELDS = ['id', 'partnerId'];

Router.use('/:recipe/embed', require('body-parser').urlencoded({extended: true}));
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
  buildRecipe(req, res, function(err, files) {
    if (err) return res.status(500).json(err);
    else res.json(files);
  });
});

Router.post('/:recipe/embed', function(req, res) {
  req.body = {
    answers: req.body
  }
  req.body.language = 'javascript';
  req.body.page = req.query.page;
  for (answer in req.body.answers) {
    req.body.answers[answer] = JSON.parse(req.body.answers[answer]);
  }
  buildRecipe(req, res, function(err, files) {
    if (err) return res.status(500).json(err);
    else res.send(files[0].contents);
  })
});

var buildRecipe = function(req, res, callback) {
  var recipe = Recipes[req.params.recipe];
  var actions = recipe.actions;
  var views = recipe.views;
  var language = req.body.language;
  CodeBuilders.RecipeV2.fixAnswers(req.body.answers, function(err, answers) {
    if (err) return res.status(500).send('Error parsing answers');
    var buildParams = {answers: answers, actions: {}, views: {}};
    buildParams.main = recipe.pages[req.body.page || 0];
    buildParams.language = language;
    actions.forEach(function(action) {
      var actionTmpl = CodeTemplates.actions[action.action] ? CodeTemplates.actions[action.action][language] : null;
      if (!actionTmpl && action.service) {
        var actionKey = action.action.indexOf('Action') === -1 ? action.action
              : action.action.substring(0, action.action.length - 6);
        var actionSchema = Schema.services[action.service].actions[actionKey];
        var codeParams = {
          parameters: [],
          service: action.service,
          action: action.action,
          returns: actionSchema.returns && actionSchema.returns.indexOf('ListResponse') !== -1 ? 'list' : 'object',
        }
        for (parameter in actionSchema.parameters) {
          var type = actionSchema.parameters[parameter].type;
          var paramObject = {name: parameter, class: type}
          codeParams.parameters.push(paramObject);
          if (type.indexOf('Kaltura') !== 0) continue;
          paramObject.fields = [];
          var cls = Schema.classes[type];
          if (!cls) throw new Error('Type ' + type + ' not found in schema');
          for (field in cls.properties) {
            if (BLACKLISTED_FIELDS.indexOf(field) === -1) {
              var fieldType = cls.properties[field].type;
              paramObject.fields.push({
                  name: field,
                  type: fieldType,
              });
            }
          }
        }
        actionTmpl = EJS.render(CodeTemplates.generic_actions[language], codeParams);
      }
      if (!actionTmpl) return;

      var actionName = action.action;
      if (actionName.indexOf('Action') === actionName.length - 6) {
        actionName = actionName.substring(0, actionName.length - 6);
      }
      if (action.service) {
        actionName += action.service.charAt(0).toUpperCase() + action.service.substring(1);
      }

      buildParams.actions[actionName] = {view: action.view, forceServer: action.forceServer};
      buildParams.actions[actionName][language] = actionTmpl;
    });
    buildParams.actions.setup = {};
    buildParams.actions.setup[language] = CodeTemplates.setups[language];
    buildParams.views.setup = {};
    buildParams.views.setup[language] = CodeTemplates.setups['html'];
    views.forEach(function(viewName) {
      buildParams.views[viewName] = {};
      buildParams.views[viewName][language] = CodeTemplates.views[viewName][language] || CodeTemplates.views[viewName].html;
    });
    buildParams.staticFiles = CodeTemplates.static[language];
    CodeBuilders.RecipeV2.build(buildParams, callback);
  });
};

