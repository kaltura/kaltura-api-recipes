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
    changeTimeout = setTimeout(refreshAll, 1000);
  }

  $scope.activeComponent = $scope.recipe.control_sets[0].affects;

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
  }, {
    id: 'node', label: 'NodeJS'
  }];

  $scope.setLanguage = function(language) {
    $scope.language = language;
    $scope.start();
  }
});

var USE_COOKIES = true;
var COOKIE_TIMEOUT_MS = 900000;
var getStoredCredentials = function() {
  var stored = '{}';
  if (USE_COOKIES) {
    var cookies = document.cookie.split(';');
    var credCookie = cookies.filter(function(c) {
      return c.indexOf(STORAGE_KEY) === 0;
    })[0];
    if (credCookie) stored = credCookie.substring(STORAGE_KEY.length + 1);
  } else {
    var local = localStorage.getItem(STORAGE_KEY);
    if (local) stored = local;
  }
  try {
    stored = JSON.parse(stored);
  } catch (e) {
    console.log('Error parsing credentials:' + stored);
    stored = {};
  }
  return stored;
}
var storeCredentials = function(creds) {
  if (USE_COOKIES) {
    var now = new Date();
    var expires = new Date(now.getTime() + COOKIE_TIMEOUT_MS);
    var cookie = STORAGE_KEY + '=' + JSON.stringify(creds) + '; expires=' + expires.toUTCString();
    document.cookie = cookie;
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
  }
}

app.controller('Answers', function($scope) {
  $scope.answers = {};
  var credentialsChanged = function() {
    if ($scope.answers.partnerId && $scope.answers.adminSecret) {
      startKalturaSession($scope.answers.partnerId, $scope.answers.userId, $scope.answers.adminSecret);
    }
    var stored = getStoredCredentials();
    stored.partnerId = $scope.answers.partnerId;
    stored.adminSecret = $scope.answers.adminSecret;
    stored.userId = $scope.answers.userId || '';
    storeCredentials(stored);
  }
  $scope.$watch('answers.partnerId', credentialsChanged);
  $scope.$watch('answers.adminSecret', credentialsChanged);
  $scope.$watch('answers.userId', credentialsChanged);

  $scope.setDefaults = function() {
    var stored = getStoredCredentials();
    for (key in stored) {
      $scope.answers[key] = stored[key];
    }
    for (key in $scope.recipe.defaults) {
      if (!$scope.answers[key]) $scope.answers[key] = $scope.recipe.defaults[key];
    }
  }
  $scope.setDefaults();
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
      $scope.files = files.filter(function(f) {return !f.hidden && !f.directory});
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
    var curSet = $scope.recipe.control_sets[$scope.controlSetIdx];
    if (curSet.page === -1) {
      $('.demo-frame').attr('src', '');
    } else {
      var answers = $('#Answers').scope().answers;
      var page = curSet.page || 0;
      var url = '/recipes/' + $scope.recipe.name + '/embed?page=' + page;
      var form = $('#DemoForm').html('');
      form.attr('action', url);
      for (answer in answers) {
        if (typeof answers[answer] === 'undefined' || answers[answer] === null) continue;
        form.append('<input type="text" name="' + answer + '" />');
        form.find('input[name="' + answer + '"]').val(JSON.stringify(answers[answer]))
      }
      form.submit();
    }
  }
  $scope.refresh();
});
