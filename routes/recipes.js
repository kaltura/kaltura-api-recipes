var Async = require('async');
var EJS = require('ejs');
var FS = require('fs');
var Path = require('path');
var Recipes = require('../recipes/recipes.js');

var RecipeServer = require('lucy-recipes');

var CodeTemplates = require('kaltura-codegen');
var Schema = require('kaltura-schema');

var BLACKLISTED_FIELDS = ['id', 'partnerId'];
var ACTION_FIELDS = ['list', 'clone', 'delete'];

var camelToUnderscore = function(camel) {
  return camel.replace(/(\w+\.)(.*)/g, function(whole, variable, member) {
    return variable + member.replace(/([a-z])([A-Z])/g, function(whole, lower, upper) {
      return lower + '_' + upper.toLowerCase();
    });
  })
}

var fixRubyVariables = function(html) {
  return html.replace(/if="([^"]+)"/g, function(whole, cond) {
    cond = camelToUnderscore(cond);
    return 'if="' + cond + '"';
  }).replace(/in="([^"]+)"/g, function(whole, group) {
    group = camelToUnderscore(group);
    return 'in="' + group + '"'; 
  }).replace(/inputvars="(.*)"/g, function(whole, vars) {
    return 'inputvars="' + camelToUnderscore(vars) + '"';
  }).replace(/\{\{([^\}]+)\}\}/g, function(whole, variable) {
    variable = variable.trim();
    if (variable.indexOf('answers') !== 0) {
      variable = camelToUnderscore(variable);
    }
    return '{{ ' + variable + ' }}';
  })
}

var setup = function(callback) {
  Schema.initialize(function() {
    var actions = CodeTemplates.actions;
    var views = CodeTemplates.views;
    for (var service in Schema.services) {
      var serviceSchema = Schema.services[service];
      for (var action in serviceSchema.actions) {
        var actionSchema = serviceSchema.actions[action];
        var codeParams = {
          parameters: [],
          service: service,
          action: action,
          returns: actionSchema.returns && actionSchema.returns.indexOf('ListResponse') !== -1 ? 'list' : 'object',
        }
        if (ACTION_FIELDS.indexOf(action) !== -1) codeParams.action += 'Action';
        for (parameter in actionSchema.parameters) {
          var type = actionSchema.parameters[parameter].type;
          var paramObject = {name: parameter, class: type}
          var enumType = actionSchema.parameters[parameter].enumType;
          if (enumType) paramObject.enum = {name: enumType, values: Schema.enums[enumType].values};
          codeParams.parameters.push(paramObject);
          if (type.indexOf('Kaltura') !== 0) continue;

          paramObject.fields = [];
          var cls = Schema.classes[type];
          if (!cls) throw new Error('Type ' + type + ' not found in schema');
          for (field in cls.properties) {
            if (BLACKLISTED_FIELDS.indexOf(field) !== -1) continue;
            var fieldType = cls.properties[field].type;
            var enumType = cls.properties[field].enumType;
            var field = {
                name: field,
                type: fieldType,
            };
            if (enumType) field.enum = {name: enumType, values: Schema.enums[enumType].values};
            paramObject.fields.push(field);
          }
        }
        var actionName = action;
        actionName = actionName.replace(/Action$/, '');
        actionName += service.charAt(0).toUpperCase() + service.substring(1);
        actions[actionName] = actions[actionName] || {};
        for (lang in CodeTemplates.generic_actions) {
          if (!actions[actionName][lang]) {
            actions[actionName][lang] = EJS.render(CodeTemplates.generic_actions[lang], codeParams);
          }
        }
      }
    }

    actions.setup = {};
    views.setup = {};
    for (lang in CodeTemplates.setups) {
      actions.setup[lang] = CodeTemplates.setups[lang];
      views.setup[lang] = CodeTemplates.setups[lang + '-html'] || CodeTemplates.setups['html'];
    }

    for (view in views) {
      if (view === 'setup') continue;
      if (!views[view].ruby && views[view].all) views[view].ruby = fixRubyVariables(views[view].all);
    }

    var recipeParams = {
      actions: actions,
      views: views,
      staticFiles: CodeTemplates.static,
      recipes: Recipes.recipes,
      save: Recipes.save,
      dependencies: {
        ruby: ['kaltura-client']
      },
      languageOptions: {
        ruby: {hashMethod: 'getter'}
      },
      rootDir: '/recipes_embed',
      galleryTitle: 'Kaltura VPaaS Interactive Code Cookbook',
      recipeTitle: 'Kaltura VPaaS Cookbook: {{ recipe }} Recipe',
      cssIncludes: [
        '/css/bootstrap.css',
        '/css/recipe-overrides.css',
      ],
      jsIncludes: [
        '/js/kaltura/ox.ajast.js',
        '/js/kaltura/webtoolkit.md5.js',
        '/js/kaltura/KalturaClientBase.js',
        '/js/kaltura/KalturaTypes.js',
        '/js/kaltura/KalturaVO.js',
        '/js/kaltura/KalturaServices.js',
        '/js/kaltura/KalturaClient.js',
        '/js/includes/mixpanel.js',
        '/js/includes/kc-setup.js',
        '/js/includes/dynamic-choices.js',
        '/js/includes/answer-defaults.js',
        '/js/includes/download-info.js',
      ],
      development: process.env.DEVELOPMENT,
      enableEditor: process.env.DEVELOPMENT,
    }

    var server = new RecipeServer(recipeParams);
    callback(server);
  });
}

module.exports = {
  getRouter: function(callback) {
    setup(function(server) {
      callback(server.router);
    })
  }
}

