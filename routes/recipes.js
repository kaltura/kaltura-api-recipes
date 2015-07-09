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
var Schema = null;

var BLACKLISTED_FIELDS = ['id', 'partnerId'];

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
        var paramJS = actionJS.parameters[param.$.name] = {type: param.$.type};
      });
    });
  });

  result.classes[0].class.forEach(function(cls) {
    var classJS = Schema.classes[cls.$.name] = {properties: {}};
    var props = cls.property || [];
    if (cls.$.base) {
      var copyBaseProps = function(baseName) {
        var baseClass = result.classes[0].class.filter(function(baseClass) {return baseName === baseClass.$.name })[0];
        if (baseClass.property) props = props.concat(baseClass.property);
        if (baseClass.$.base) copyBaseProps(baseClass.$.base);
      }
      copyBaseProps(cls.$.base);
    }
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
  buildRecipe(req, res, function(err, files) {
    if (err) return res.status(500).json(err);
    else res.json(files);
  });
});

Router.get('/:recipe/embed', function(req, res) {
  req.body = req.body || {};
  req.body.language = 'javascript';
  req.body.answers = {};
  for (key in req.query) {
    req.body.answers[key] = JSON.parse(req.query[key]);
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
    buildParams.main = recipe.pages[0];
    buildParams.language = language;
    actions.forEach(function(action) {
      var codeParams = {
        parameters: [],
        service: action.service,
        action: action.action,
        returns: action.action === 'listAction' ? 'list' : 'object',
      }
      var actionKey = action.action.indexOf('Action') === -1 ? action.action
            : action.action.substring(0, action.action.length - 6);
      var actionSchema = Schema.services[action.service].actions[actionKey];
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
      var rendered = EJS.render(CodeTemplates.actions[language], codeParams);
      var actionName = action.action;
      if (actionName.indexOf('Action') === actionName.length - 6) {
        actionName = actionName.substring(0, actionName.length - 6);
      }
      actionName += action.service.charAt(0).toUpperCase() + action.service.substring(1);

      buildParams.actions[actionName] = {view: action.view};
      buildParams.actions[actionName][language] = rendered;
    });
    buildParams.actions.setup = {};
    buildParams.actions.setup[language] = CodeTemplates.setups[language];
    views.forEach(function(viewName) {
      buildParams.views[viewName] = {};
      buildParams.views[viewName][language] = CodeTemplates.views[viewName];
    });
    CodeBuilders.RecipeV2.build(buildParams, callback);
  });
};

