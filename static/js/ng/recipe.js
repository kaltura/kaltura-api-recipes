var STORAGE_KEY = 'KALTURA_CREDS';
var MS_IN_MONTH = 1000 * 60 * 60 * 24 * 30;

app.controller('Recipe', function($scope) {
  $scope.provider = PROVIDER = 'kaltura';
  $scope.recipe = RECIPE;
  $scope.recipe.finish = $scope.recipe.finish || {};
  mixpanel.track('enter_recipe', {
    recipe: $scope.recipe.name
  });
  $scope.recipe.recipe_steps.forEach(function(set) {
    if (Array.isArray(set.tip)) {
      set.tip = set.tip.join('\n\n');
    }
  })

  $scope.ready = false;

  var changeTimeout = null;
  var refreshAll = function() {
    angular.element('#Code').scope().refresh();
    if (!$scope.recipe.recipe_steps[$scope.recipeStepIdx].disable_autorefresh) angular.element('#Demo').scope().refresh();
  }

  $scope.refreshDemo = function() {
    angular.element('#Demo').scope().refresh();
  }

  $scope.onAnswerChanged = function() {
    if (changeTimeout) clearTimeout(changeTimeout);
    changeTimeout = setTimeout(refreshAll, 1000);
  }

  $scope.activeComponent = $scope.recipe.recipe_steps[0].code_snippet;

  $scope.recipeStepIdx = -1;
  $scope.setControlSet = function(recipeStepIdx) {
    $scope.recipeStepIdx = recipeStepIdx;
    if (recipeStepIdx === $scope.recipe.recipe_steps.length) {
      mixpanel.track('recipe_finish', {
        recipe: $scope.recipe.name
      });
    } else {
      mixpanel.track('view_step', {
        step: recipeStepIdx,
        recipe: $scope.recipe.name,
      })
    }
    if (recipeStepIdx === -1 || recipeStepIdx === $scope.recipe.recipe_steps.length) {
      return;
    }
    var curSet = $scope.recipe.recipe_steps[$scope.recipeStepIdx];
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
    var affected = $scope.recipe.recipe_steps[recipeStepIdx].code_snippet;
    angular.element('#Code').scope().setActiveComponent(affected);
    $scope.onAnswerChanged();
  }

  $scope.start = function() {
    if (!$scope.ready) {
      $scope.ready = true;
      $scope.setControlSet(0);
    }
    angular.element('#Code').scope().refresh();
  }

  $scope.backToCookbook = function() {
    window.location.href = '/';
  }
});

app.controller('Language', function($scope) {
  $scope.languages = [{
    id: 'javascript', label: 'JavaScript'
  }, {
    id: 'php', label: 'PHP'
  }, {
    id: 'node', label: 'NodeJS'
  }, {
    id: 'ruby', label: 'Ruby'
  }];

  $scope.setLanguage = function(language) {
    mixpanel.track('set_language', {
      language: language
    })
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
    if ($scope.answers.partnerId && $scope.answers.secret) {
      startKalturaSession($scope.answers.partnerId, $scope.answers.userId, $scope.answers.secret);
    }
    var stored = getStoredCredentials();
    stored.partnerId = $scope.answers.partnerId;
    stored.secret = $scope.answers.secret;
    stored.userId = $scope.answers.userId || '';
    storeCredentials(stored);
  }
  $scope.$watch('answers.partnerId', credentialsChanged);
  $scope.$watch('answers.secret', credentialsChanged);
  $scope.$watch('answers.userId', credentialsChanged);
  var useDates = function(newDate) {
    if (!newDate) return;
    delete $scope.answers.toDay;
    delete $scope.answers.fromDay;
  }
  var useDays = function(newDay) {
    if (!newDay) return;
    delete $scope.answers.toDate;
    delete $scope.answers.fromDate;
    var datetime = $('[ng-controller="DateTime"]');
    datetime.each(function() {
      $(this).scope().dateFocused = false;
    });
  }
  $scope.$watch('answers.toDay', useDays);
  $scope.$watch('answers.fromDay', useDays);
  $scope.$watch('answers.toDate', useDates);
  $scope.$watch('answers.fromDate', useDates);

  $scope.setDefaults = function() {
    var stored = getStoredCredentials();
    for (key in stored) {
      $scope.answers[key] = stored[key];
    }
    var today = new Date();
    var lastMonth = new Date(today.getTime() - MS_IN_MONTH);
    var getDayStr = function(d) {
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length < 2) month = '0' + month;
      var day = d.getDate().toString();
      if (day.length < 2) day = '0' + day;
      return year + month + day;
    }
    $scope.answers.toDay = getDayStr(today);
    $scope.answers.fromDay = getDayStr(lastMonth);
    for (key in $scope.recipe.defaults) {
      if (!$scope.answers[key]) $scope.answers[key] = $scope.recipe.defaults[key];
    }
  }
  $scope.setDefaults();
});

app.controller('Code', function($scope) {
  $scope.expanded = false;
  $scope.files = [];

  $scope.getHLJSLanguage = function() {
    if ($scope.activeFileIdx >= 0) {
      var filename = $scope.files[$scope.activeFileIdx].filename;
      if (filename.indexOf('.html') !== -1) return 'html'
    }
    var ret = $('#Language').scope().language.id;
    return ret === 'node' ? 'javascript' : ret;
  }

  $scope.refresh = function() {
    var curSet = $scope.recipe.recipe_steps[$scope.recipeStepIdx];
    var page = curSet.page || 0;
    if (page === -1) page = 0;
    var data = {
      language: $('#Language').scope().language.id,
      answers: $('#Answers').scope().answers,
      page: page,
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
    var curSet = $scope.recipe.recipe_steps[$scope.recipeStepIdx];
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
  if (!$scope.recipe.recipe_steps[$scope.recipeStepIdx].disable_autorefresh) {
    $scope.refresh();
  }
});

app.controller('Feedback', function($scope) {
  $scope.feedback = {
    rating: -1,
    hoverRating: -1,
  }
  $scope.alert = {};
  $scope.rateRecipe = function(rating) {
    $scope.feedback.rating = rating;
    mixpanel.track('rate_recipe', {
      recipe: $scope.recipe.name,
      rating: rating,
    })
  }
  $scope.sendFeedback = function() {
    $scope.alert = {};
    mixpanel.track('feedback', {
      recipe: $scope.recipe.name,
      feedback: $scope.feedback.text,
    });
    if (!$scope.feedback.text) {
      $scope.alert.danger = 'Please enter some text above.';
    } else {
      $scope.feedback.text = '';
      $scope.alert.success = 'Thanks!';
      setTimeout(function() {
        $scope.alert.success = '';
        $scope.$apply();
      }, 2000);
    }
  }
})
