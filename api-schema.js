var FS = require('fs');
var Path = require('path');
var XMLParser = require('xml2js').parseString;

var SchemaXML = FS.readFileSync(Path.join(__dirname, 'api_schema.xml'), 'utf8');
var Schema = module.exports = {classes: {}, services: {}};

var BLACKLISTED_FIELDS = ['id', 'partnerId'];

XMLParser(SchemaXML, function(err, result) {
  if (err) throw err;
  result = result.xml;

  result.services[0].service.forEach(function(service) {
    var serviceJS = Schema.services[service.$.name] = {actions: {}};
    var actions = service.action;
    actions.forEach(function(action) {
      var actionJS = serviceJS.actions[action.$.name] = {parameters: {}};
      var result = action.result[0];
      if (result) actionJS.returns = result.$.type;
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

