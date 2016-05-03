<%
function getFieldSetter(field, parents, answers) {
  var answerName = '';
  parents.forEach(function(p) {
    if (!answerName) answerName += p
    else answerName += '[' + p + ']'
  });
  var parentObjType = answers[answerName + '[objectType]'];
  if (field.objectType && parentObjType !== field.objectType) return;

  answerName += '[' + field.name + ']';
  var setter = (parents.length ? parents.join('.') + '.' : 'var ') + field.name + ' = ';
  if (field.type.indexOf('Kaltura') === 0) {
    fieldObjType = answers[answerName + '[objectType]'];
    if (parents.length && fieldObjType === undefined) return;
    setter += 'new ' + (fieldObjType || field.type) + '()';
    subsetters = field.fields.map(function(f) {
      return getFieldSetter(f, parents.concat([field.name]), answers);
    }).filter(function(s) {return s});
    return setter + '\n' + subsetters.join('\n')
  } else {
    answer = answers[answerName];
    if (answer === undefined) return;
    if (!field.enum) {
      return setter + JSON.stringify(answer);
    } else {
      for (var valName in field.enum.values) {
        if (field.enum.values[valName] === answer) {
          return setter + field.enum.name + '.' + valName;
        }
      }
    }
  }
}
-%>

<%  parameters.forEach(function(param) { -%>
<%  var setter = getFieldSetter(param, [], answers); %>
<%    if (setter) { -%>
<%- setter %>
<%    } -%>
<%  }) -%>

client.<%- service %>.<%- action %>(function(success, results) {
  if (!success || (results && results.code && results.message)) {
    console.log('Kaltura Error', success, results);
  } else {
    console.log('Kaltura Result', results);
  }
}<%- parameters.length === 0 ? ');' : ',' %>
<% parameters.forEach(function(param, index) { -%>
<%- param.name %><%- index < parameters.length - 1 ? ',' : ');' %>
<% }); -%>
