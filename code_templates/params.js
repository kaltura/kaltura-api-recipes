var Schema = require('kaltura-schema');
var BLACKLISTED_FIELDS = ['id', 'partnerId'];
var ACTION_FIELDS = ['list', 'clone', 'delete'];

module.exports = function(cb) {
  Schema.initialize(function() {
    renderParams = {};
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
          var paramObject = {name: parameter, class: type, type: type};
          var enumType = actionSchema.parameters[parameter].enumType;
          if (enumType) paramObject.enum = {name: enumType, values: Schema.enums[enumType].values};
          codeParams.parameters.push(paramObject);
          if (type.indexOf('Kaltura') !== 0) continue;

          function addFieldsFromClass(fields, className, restrict, depth) {
            if (depth === undefined) depth = 4;
            if (depth <= 0) return;
            var cls = Schema.classes[className]
            if (!cls) {
              console.log('Type ' + type + ' not found in schema');
              return;
            }
            for (var fieldName in cls.properties) {
              if (BLACKLISTED_FIELDS.indexOf(fieldName) !== -1) continue;
              var fieldType = cls.properties[fieldName].type;
              var existing = fields.filter(f => f.name === fieldName && (!f.objectType || f.objectType === className));
              if (existing.length) continue;
              var field = {
                  name: fieldName,
                  type: fieldType,
              };
              if (restrict) field.objectType = className;
              var enumType = cls.properties[fieldName].enumType;
              if (enumType) field.enum = {name: enumType, values: Schema.enums[enumType].values}
              if (field.type.indexOf('Kaltura') === 0) {
                field.fields = [];
                addFieldsFromClass(field.fields, field.type, false, depth - 1);
              }
              fields.push(field);
            }
            (cls.subclasses || []).forEach(function(subcls) {
              addFieldsFromClass(fields, subcls, true, depth - 1);
            })
          }
          paramObject.fields = [];
          addFieldsFromClass(paramObject.fields, type);
        }
        renderParams[serviceSchema.id] = renderParams[serviceSchema.id] || {};
        renderParams[serviceSchema.id][action] = codeParams;
      }
    }
    cb(renderParams);
  });
}
