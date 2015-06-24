app.controller('Recipe', function($scope) {
  $scope.provider = PROVIDER = 'kaltura';
  $scope.recipe = RECIPE;

  $scope.controlSetIdx = -1;
  $scope.ready = false;

  $scope.onAnswerChanged = function() {
    angular.element('#Code').scope().refresh();
    angular.element('#Demo').scope().refresh();
  }

  $scope.activeComponent = $scope.recipe.control_sets[0].affects;

  $scope.getDemoUrl = function() {
    var answers = angular.element('#Answers');
    answers = answers && answers.scope() ? answers.scope().answers : {};
    var demoURL = '/recipes/' + $scope.recipe.name + '/embed?'
    for (key in answers) {
      demoURL += '&' + key + '=' + encodeURIComponent(JSON.stringify(answers[key]));
    }
    return demoURL;
  }

  $scope.start = function() {
    if (!$scope.ready) {
      $scope.ready = true;
    }
    angular.element('#Code').scope().refresh();
  }
});

app.controller('Language', function($scope) {
  $scope.languages = [{
    id: 'javascript', label: 'JavaScript'
  }, {
    id: 'php', label: 'PHP'
  }];

  $scope.setLanguage = function(language) {
    $scope.language = language;
    $scope.start();
  }
});

app.controller('Answers', function($scope) {
  $scope.answers = {};

  $scope.setDefaults = function() {
    $scope.recipe.control_sets.forEach(function(set) {
      if (!set.inputs) return;
      set.inputs.forEach(function(input) {
        if (input.type === 'group') {
          input.inputs.forEach(function(input) {
            if (input.default) $scope.answers[input.name] = input.default;
          })
        } else {
          if (input.default) $scope.answers[input.name] = input.default;
        }
      })
    })
  }

  $scope.setControlSet = function(controlSetIdx) {
    $scope.controlSetIdx = controlSetIdx;
    if (controlSetIdx >= 0) {
      var affected = $scope.recipe.control_sets[controlSetIdx].affects;
      angular.element('#Code').scope().setActiveComponent(affected);
    }
  }
  $scope.openDemo = function() {
    var demoUrl = $scope.getDemoUrl();
    window.open(demoUrl, '_blank');
  }
});

app.controller('Code', function($scope) {
  $scope.expanded = false;
  $scope.files = [];
  $scope.refresh = function() {
    var data = {
      language: $('#Language').scope().language.id,
      answers: $('#Answers').scope().answers
    }
    $.post('/recipes/' + $scope.recipe.name + '/code', data)
    .success(function(files) {
      $scope.files = files;
      $scope.files.forEach(function(f) {
        var slash = f.filename.lastIndexOf('/');
        if (slash !== -1) f.filename = f.filename.substring(slash + 1);
      })
      $scope.setActiveComponent($scope.activeComponent);
      $scope.$apply();
    })
    .fail(function(err) {
      console.log('fail', err);
    });
  }

  $scope.setFile = function(fileIdx) {
    $scope.activeFileIdx = fileIdx;
  }

  $scope.setActiveComponent = function(component) {
    $scope.activeComponent = component;
    for (var i = 0; i < $scope.files.length; ++i) {
      var f = $scope.files[i];
      if (f.snippets && f.snippets[component]) {
        $scope.setFile(i);
        return;
      }
    }
    $scope.setFile($scope.activeFileIdx);
  }

  $scope.toggleExpand = function() {
    $scope.expanded = !$scope.expanded;
  }

  $scope.getActiveCode = function() {
    var file = $scope.files[$scope.activeFileIdx];
    if (!file) {
      return 'No code yet...';
    }
    if ($scope.expanded || !file.snippets) {
      return file.contents;
    }
    var snippet = file.snippets[$scope.activeComponent];
    if (snippet) {
      return snippet;
    }
    var snipKeys = Object.keys(file.snippets);
    if (snipKeys.length === 1 && file.snippets[snipKeys[0]]) {
      return file.snippets[snipKeys[0]];
    } else {
      return file.contents;
    }
  }
})

app.controller('Demo', function($scope) {
  $scope.refresh = function() {
    var demoUrl = $scope.getDemoUrl();
    $('.demo-frame').attr('src', demoUrl);
  }
  $scope.refresh();
})
