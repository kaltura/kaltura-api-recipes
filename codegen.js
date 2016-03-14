var FS = require('fs');
var EJS = require('ejs');
var Router = require('express').Router();
var Schema = require('kaltura-schema');
var Lucy = require('lucy-codegen').Lucy;
var KCode = require('kaltura-codegen'),
    CodeTemplates = KCode.templates;

var BLACKLISTED_FIELDS = ['id', 'partnerId'];
var ACTION_FIELDS = ['list', 'clone', 'delete'];

var EXT = {node: '.js', javascript: '.js', ruby: '.rb', php: '.php'}

var renderParams = {};
module.exports = {};
module.exports.initialize = function(cb) {
  Schema.initialize(function() {
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
          paramObject.abstract = (cls.abstract || cls.subclasses) ? true : false;
          function addProps(props, objectType) {
            for (var fieldName in props) {
              if (BLACKLISTED_FIELDS.indexOf(fieldName) !== -1) continue;
              var fieldType = props[fieldName].type;
              var enumType = props[fieldName].enumType;
              var existing = paramObject.fields.filter(f => f.name === fieldName && (!f.objectType || f.objectType === objectType));
              if (existing.length) continue;
              var field = {
                  name: fieldName,
                  type: fieldType,
                  objectType: objectType,
              };
              if (enumType) field.enum = {name: enumType, values: Schema.enums[enumType].values};
              paramObject.fields.push(field);
            }
          }
          addProps(cls.properties);
          (cls.subclasses || []).forEach(function(subcls) {
            addProps(Schema.classes[subcls].properties, subcls);
          })
        }
        renderParams[serviceSchema.id] = renderParams[serviceSchema.id] || {};
        renderParams[serviceSchema.id][action] = codeParams;
      }
    }

    Router.post('/code/build/request', function(req, res) {
      if (process.env.DEVELOPMENT) KCode.populateTemplates();
      var path = req.body.request.path;
      var parts = path.match(/service\/(\w+)\/action\/(\w+)$/);
      var service = parts[1], action = parts[2];
      var lang = req.body.language;
      var codeParams = renderParams[service][action];
      var tmpl = CodeTemplates.generic_actions[lang];
      req.body.request.query = req.body.request.query || {};
      tmpl = EJS.render(tmpl, codeParams);
      var answers = {};
      for (var key in req.body.answers) {
        answers[key] = {val: req.body.answers[key]};
      }
      var lucy = new Lucy(lang, answers);
      lucy.returnCode = function(val, tabs) {
        var ret = '';
        if (lang === 'javascript' || lang === 'node') {
          ret = 'console.log(' + val + ')';
        } else if (lang === 'ruby') {
          ret = 'puts ' + val;
        } else if (lang === 'php') {
          ret = 'echo ' + val;
        }
        for (var i = 0; i < tabs; ++i) ret = ' ' + ret;
        return ret;
      }
      var code = EJS.render(tmpl, {
        Lucy: lucy,
      })
      res.json({code: code});
    })
    cb(Router);
  });
}
