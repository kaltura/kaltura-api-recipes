var FS = require('fs');
var Path = require('path');
var XMLParser = require('xml2js').parseString;

var SchemaXML = FS.readFileSync(Path.join(__dirname, 'api_schema.xml'), 'utf8');
var Schema = module.exports = {classes: {}, services: {}, enums: {}};

Schema.initialize = function(callback) {
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
          var paramJS = actionJS.parameters[param.$.name] = {type: param.$.type, enumType: param.$.enumType};
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
        propJS.type = prop.$.type;
        propJS.enumType = prop.$.enumType;
      });
    });

    result.enums[0].enum.forEach(function(en) {
      var enumJS = Schema.enums[en.$.name] = {values: {}};
      vals = en.const || []
      vals.forEach(function(val) {
        enumJS.values[val.$.name] = val.$.value;
        if (en.$.enumType === 'int') enumJS.values[val.$.name] = parseInt(enumJS.values[val.$.name]);
      })
    });
    callback();
  });
}
