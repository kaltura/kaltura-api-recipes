var STORAGE_KEY = 'KALTURA_CREDS';

app.controller('Recipe', function($scope) {
  $scope.provider = PROVIDER = 'kaltura';
  $scope.recipe = RECIPE;
  $scope.recipe.control_sets.forEach(function(set) {
    if (Array.isArray(set.tip)) {
      set.tip = set.tip.join('\n\n');
    }
  })

  $scope.ready = false;

  var changeTimeout = null;
  var refreshAll = function() {
    angular.element('#Code').scope().refresh();
    angular.element('#Demo').scope().refresh();
  }
  $scope.onAnswerChanged = function() {
    if (changeTimeout) clearTimeout(changeTimeout);
    changeTimeout = setTimeout(refreshAll, 250);
  }

  $scope.activeComponent = $scope.recipe.control_sets[0].affects;

  $scope.getDemoUrl = function() {
    var answers = angular.element('#Answers');
    answers = answers && answers.scope() ? answers.scope().answers : {};
    var demoURL = '/recipes/' + $scope.recipe.name + '/embed?'
    var addedOne = false;
    var curSet = $scope.recipe.control_sets[$scope.controlSetIdx];
    if (curSet && curSet.page) {
      addedOne = true;
      demoURL += 'lucy_page=' + curSet.page;
    }
    for (key in answers) {
      if (addedOne) demoURL += '&';
      addedOne = true;
      demoURL += key + '=' + encodeURIComponent(JSON.stringify(answers[key]));
    }
    return demoURL;
  }
  
  $scope.controlSetIdx = -1;
  $scope.setControlSet = function(controlSetIdx) {
    $scope.controlSetIdx = controlSetIdx;
    if (controlSetIdx >= 0) {
      var curSet = $scope.recipe.control_sets[$scope.controlSetIdx];
      if (!curSet.inputs) return;
      var answers = $('#Answers').scope().answers;
      var setDefault = function(input) {
        if (answers[input.name] === undefined && input.default) answers[input.name] = input.default;
      }
      curSet.inputs.forEach(function(input) {
        if (input.type === 'group') {
          input.inputs.forEach(setDefault)
        } else {
          setDefault(input)
        }
      });
      var affected = $scope.recipe.control_sets[controlSetIdx].affects;
      angular.element('#Code').scope().setActiveComponent(affected);
      $scope.onAnswerChanged();
    }
  }

  $scope.start = function() {
    if (!$scope.ready) {
      $scope.ready = true;
      $scope.setControlSet(0);
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
  var credentialsChanged = function() {
    if ($scope.answers.partnerId && $scope.answers.adminSecret) {
      startKalturaSession($scope.answers.partnerId, $scope.answers.userId, $scope.answers.adminSecret);
    }
    var stored = localStorage.getItem(STORAGE_KEY) || '{}';
    stored = JSON.parse(stored);
    stored.partnerId = $scope.answers.partnerId;
    stored.adminSecret = $scope.answers.adminSecret;
    stored.userId = $scope.answers.userId || '';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
  $scope.$watch('answers.partnerId', credentialsChanged);
  $scope.$watch('answers.adminSecret', credentialsChanged);
  $scope.$watch('answers.userId', credentialsChanged);

  $scope.setDefaults = function() {
    var stored = localStorage.getItem(STORAGE_KEY) || '{}';
    stored = JSON.parse(stored);
    for (key in stored) {
      $scope.answers[key] = stored[key];
    }
    for (key in $scope.recipe.defaults) {
      if (!$scope.answers[key]) $scope.answers[key] = $scope.recipe.defaults[key];
    }
  }
  $scope.setDefaults();

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
    var url = '/recipes/' + $scope.recipe.name + '/code';
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      contentType: 'application/json'
    }).success(function(files) {
      $scope.files = files;
      $scope.files.forEach(function(f) {
        var slash = f.filename.lastIndexOf('/');
        if (slash !== -1) f.filename = f.filename.substring(slash + 1);
      })
      $scope.setActiveComponent($scope.activeComponent);
      $scope.$apply();
    }).fail(function(err) {
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
});

app.controller('Demo', function($scope) {
  $scope.refresh = function() {
    if ($scope.recipe.control_sets[$scope.controlSetIdx].page === -1) {
      $('.demo-frame').attr('src', '')
    } else {
      var demoUrl = $scope.getDemoUrl();
      $('.demo-frame').attr('src', demoUrl);
    }
  }
  $scope.refresh();
});
