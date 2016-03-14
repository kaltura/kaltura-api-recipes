window.resolveDynamicEnum = function(dc, callback) {
  if (!KC) return console.log('Error: Kaltura Client is null');
  console.log('dc', dc);
  var action = dc.action, service = dc.service;
  if (action === 'list') action += 'Action';
  var args = dc.arguments || [];
  args = args.map(function(arg) {
    var cls = new window[arg.class];
    var params = arg.parameters || {};
    for (name in params) {
      var param = params[name];
      if (param.answer) {
        cls[name] = $('#Answers').scope().answers[param.answer];
      } else if (param.enum) {
        cls[name] = window[param.enum][param.value];
      } else {
        cls[name] = param;
      }
    };
    return cls;
  });
  var kcb = function(success, results) {
    if (!success || (results.code && results.message)) {
      console.log("Kaltura Error", results);
      return callback(new Error('Error getting choices'));
    }
    var choices = results.objects.map(function(obj) {
      return {value: obj[dc.map.value], label: obj[dc.map.label]};
    });
    callback(null, choices);
  };
  args.unshift(kcb);
  var serviceObj = KC[service];
  serviceObj[action].apply(serviceObj, args);
}
