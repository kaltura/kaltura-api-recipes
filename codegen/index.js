var _ = require('lodash');
var FS = require('fs');
var EJS = require('ejs');

var TMPL_DIR = __dirname + '/templates';

var language_opts = {
  default: {
    accessor: '.',
    statementPrefix: '',
    statementSuffix: '',
    objPrefix: '',
    objSuffix: '',
    enumPrefix: '',
    enumAccessor: '',
    declarationPrefix: '',
    getValue: JSON.stringify,
    rewriteVariable: function(s) {return s},
    rewriteAction: function(s) {return s},
    rewriteService: function(s) {return s},
  },
  javascript: {
    ext: 'js',
    declarationPrefix: 'var ',
    statementSuffix: ';',
    objPrefix: 'new ',
    objSuffix: '()',
  },
  node: {
    ext: 'js',
    declarationPrefix: 'var ',
    statementSuffix: ';',
    objPrefix: 'new Kaltura.kc.objects.',
    objSuffix: '()',
    enumPrefix: 'Kaltura.kc.enums.',
  },
  php: {
    ext: 'php',
    accessor: '->',
    statementPrefix: '$',
    statementSuffix: ';',
    objPrefix: 'new ',
    objSuffix: '()',
    enumAccessor: '::',
  },
  ruby: {
    ext: 'rb',
    enumAccessor: '::',
    objSuffix: '.new()',
    rewriteVariable: function(v) {
      return v.replace(/([a-z])([A-Z])/g, function(whole, lower, upper) {
        return lower + '_' + upper.toLowerCase();
      })
    },
    rewriteAction: function(a) {
      if (a.indexOf('Action') !== -1) a = a.substring(0, a.length - 6);
      return this.rewriteVariable(a);
    },
    rewriteService: function(s) {
      return this.rewriteVariable(s) + '_service';
    }
  }
}

module.exports = CodeTemplate = function(opts) {
  this.language = opts.language;
  _.extend(this, language_opts.default, language_opts[this.language]);
  this.reload();

  this.indent = function(code, numSpaces) {
    if (!numSpaces) return code;
    var lines = code.split('\n');
    var spaces = Array(Math.abs(numSpaces) + 1).join(' ');
    if (numSpaces > 0) {
      return lines.map(function(l) {return l ? spaces + l : l}).join('\n');
    } else {
      return lines.map(function(l) {
        if (l.indexOf(spaces) === 0) return l.substring(spaces.length);
        else return l;
      }).join('\n');
    }
  }
}

CodeTemplate.prototype.reload = function() {
  var filename = TMPL_DIR + '/' + this.language + '.ejs.' + this.ext;
  this.template = FS.readFileSync(filename, 'utf8');
  if (this.language === 'javascript' || this.language === 'node') {
    filename = filename.replace('.ejs', '_setup.ejs');
    this.setupTemplate = FS.readFileSync(filename, 'utf8');
  }
}

CodeTemplate.prototype.render = function(params) {
  params.answers = params.answers || {};
  params.answers.partnerId = params.answers.partnerId || 'YOUR_PARTNER_ID';
  params.answers.secret = params.answers.secret || 'YOUR_KALTURA_SECRET';
  params.answers.userId = params.answers.userId || 'YOUR_USER_ID';
  params = _.extend({helper: this}, params);
  var code = EJS.render(this.template, params);
  if (params.showSetup && this.setupTemplate) {
    params.code = code;
    return EJS.render(this.setupTemplate, params).trim();
  } else {
    return code;
  }
}

CodeTemplate.prototype.getFieldSetter = function(field, parents, answers) {
  var self = this;
  var answerName = '';
  if (parents.length) {
    parents.forEach(function(p) {
      if (!answerName) answerName += p
      else answerName += '[' + p + ']'
    });
    var parentObjType = answers[answerName + '[objectType]'];
    if (field.objectType && parentObjType !== field.objectType) return;
    answerName += '[' + field.name + ']';
  } else {
    answerName = field.name;
  }

  var setter = this.statementPrefix;
  setter += (parents.length ? parents.map(self.rewriteVariable).join(self.accessor) + self.accessor : self.declarationPrefix);
  setter += self.rewriteVariable(field.name) + ' = ';

  if (field.type.indexOf('Kaltura') === 0) {
    fieldObjType = answers[answerName + '[objectType]'];
    if (parents.length && fieldObjType === undefined) return;
    setter += self.objPrefix + (fieldObjType || field.type) + self.objSuffix;
    subsetters = field.fields.map(function(f) {
      return self.getFieldSetter(f, parents.concat([field.name]), answers);
    }).filter(function(s) {return s});
    return setter + self.statementSuffix + (subsetters.length ? '\n' + subsetters.join('\n') : '');
  } else {
    answer = answers[answerName];
    if (answer === undefined) {
      if (parents.length) return;
      answer = '';  // TODO: use correct type
    }
    if (!field.enum) {
      setter += self.getValue(answer);
    } else {
      for (var valName in field.enum.values) {
        if (field.enum.values[valName] === answer) {
          setter += self.enumPrefix + field.enum.name + (self.enumAccessor || self.accessor) + valName;
          break;
        }
      }
    }
  }
  return setter + self.statementSuffix;
}

CodeTemplate.LANGUAGES = ['php', 'node', 'javascript', 'ruby'];
CodeTemplate.LANGUAGE_DETAILS = language_opts;
