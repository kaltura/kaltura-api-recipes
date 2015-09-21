app.controller('Input', function($scope) {
  $scope.input.label = $scope.input.label || $scope.input.name;
  if ($scope.keys && $scope.input.name in $scope.keys) {
    $scope.model = $scope.keys;
  } else {
    $scope.model = $scope.answers;
  }
})

app.controller('DateTime', function($scope) {
  $scope.date = {};
  $scope.$watch('date.date', function() {
    $scope.model[$scope.input.name] = Date.parse($scope.date.date) / 1000;
    $scope.onAnswerChanged();
  })
})

app.controller('Radio', function($scope) {
  var dc = $scope.input.dynamicChoices;
  if (dc) {
    if (!KC) return console.log('Error: Kaltura Client is null');
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
    var callback = function(success, results) {
      if (!success || (results.code && results.message)) return console.log('Kaltura Error', success, results);
      $scope.input.choices = results.objects.map(function(obj) {
        return {value: obj[dc.map.value], label: obj[dc.map.label] || obj[dc.map.value]};
      });
      $scope.$apply();
    };
    args.unshift(callback);
    var serviceObj = KC[service];
    serviceObj[action].apply(serviceObj, args);
  }
});

app.controller('Checkboxes', function($scope) {
  $scope.chosen = {};
  var defaults = $scope.model[$scope.input.name];
  if (defaults) {
    defaults.forEach(function(d) {
      $scope.chosen[d] = true;
    })
  }
  var outerChanged = $scope.onAnswerChanged;
  $scope.onAnswerChanged = function() {
    var values = Object.keys($scope.chosen).filter(
      function(k) {return $scope.chosen[k]}
    );
    $scope.model[$scope.input.name] = values;
    outerChanged();
  }
})

app.controller('DynamicArray', function($scope) {
  $scope.items = [];
  $scope.addItem = function() {
    $scope.items.push({});
  };
  $scope.removeItem = function(index) {
    $scope.items = $scope.items.filter(function(item, i) { return i !== index })
    $scope.onAnswerChanged();
  }

  var outerChanged = $scope.onAnswerChanged;
  $scope.onAnswerChanged = function() {
    $scope.model[$scope.input.name] = $scope.items.map(function(item) {return item.value});
    outerChanged();
  }
})
