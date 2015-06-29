app.controller('Input', function($scope) {
  if ($scope.keys && $scope.input.name in $scope.keys) {
    $scope.model = $scope.keys;
  } else {
    $scope.model = $scope.answers;
  }
})

app.controller('Radio', function($scope) {
  var dc = $scope.input.dynamicChoices;
  if (dc) {
    var action = dc.action, service = dc.service;
    console.log('dc', action, service);
    if (action === 'list') action += 'Action';
    KC[service][action](function(success, results) {
      if (!success || (results.code && results.message)) return console.log('Kaltura Error', success, results);
      $scope.input.choices = results.objects.map(function(obj) {
        return {value: obj[dc.map.value], label: obj[dc.map.label]};
      });
      $scope.$apply();
    });
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
