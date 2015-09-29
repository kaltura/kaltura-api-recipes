var STORAGE_KEY = 'KALTURA_CREDS';
var MS_IN_MONTH = 1000 * 60 * 60 * 24 * 30;

app.controller('Recipe', function($scope) {
  $scope.provider = PROVIDER = 'kaltura';
  $scope.recipe = RECIPE;
  mixpanel.track('enter_recipe', {
    recipe: $scope.recipe.name
  });
  
  $scope.recipe.finish = $scope.recipe.finish || {};
  $scope.recipe.recipe_steps.forEach(function(set) {
    if (Array.isArray(set.tip)) {
      set.tip = set.tip.join('\n\n');
    }
  });

  $scope.getStepTitle = function(idx) {
    var title = 'Step ' + (idx + 1) + '. ';
    if (idx === -1) return title + 'Choose Language';
    if (idx === $scope.recipe.recipe_steps.length) return title + 'Finish';
    title += $scope.recipe.recipe_steps[idx].title || 'Untitled';
    return title;
  }

  $scope.ready = false;

  $scope.setLanguage = function(language) {
    mixpanel.track('set_language', {
      language: language
    })
    $scope.language = language;
    $scope.ready = true;
    $('#Code').scope().refresh();
  }

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

  $scope.snippetName = $scope.recipe.recipe_steps[0].code_snippet;

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
    var snippetName = $scope.recipe.recipe_steps[recipeStepIdx].code_snippet;
    angular.element('#Code').scope().setSnippetName(snippetName);
    $scope.onAnswerChanged();
  }

  $scope.backToCookbook = function() {
    window.location.href = '/';
  }
});

app.controller('Language', function($scope) {
  $scope.languages = [];
  $.getJSON('/languages', function(langs) {
    $scope.languages = langs;
    $scope.$apply();
  })
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

  $scope.refresh = function() {
    var curSet = $scope.recipe.recipe_steps[$scope.recipeStepIdx];
    var page = curSet ? curSet.page || 0 : 0;
    if (page === -1) page = 0;
    var data = {
      language: $scope.language.id,
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
      $scope.setSnippetName($scope.snippetName || (curSet ? curSet.code_snippet : undefined));
      $scope.$apply();
    }).fail(function(err) {
      console.log('fail', err);
    });
  }

  $scope.setFile = function(file) {
    $scope.activeFile = file;
  }

  $scope.setSnippetName = function(snippetName) {
    $scope.snippetName = snippetName;
    for (var i = 0; i < $scope.files.length; ++i) {
      var f = $scope.files[i];
      if (f.snippets && f.snippets[snippetName]) {
        $scope.setFile(f);
        return;
      }
    }
  }

  $scope.toggleExpand = function() {
    $scope.expanded = !$scope.expanded;
  }

  var setCodeSnippet = function(changed, oldVal, newVal) {
    var file = $scope.activeFile;
    if (!file) {
      $scope.codeSnippet = 'No code yet...';
    } else if ($scope.expanded || !file.snippets) {
      $scope.codeSnippet = file.contents;
    } else {
      var snippet = file.snippets[$scope.snippetName];
      if (snippet) {
        $scope.codeSnippet = snippet;
      } else {
        $scope.codeSnippet = file.contents;
      }
    }
  }
  var setHLJSLanguage = function() {
    if (!$scope.language) return '';
    if ($scope.activeFile) {
      var isHTML = $scope.activeFile.filename.indexOf('.html') !== -1 && $scope.codeSnippet.match(/<\w+.*>/);
      if (isHTML) {
        $scope.hljsLanguage = 'html';
        return;
      }
    }
    var ret = $scope.language.id;
    $scope.hljsLanguage = ret === 'node' ? 'javascript' : ret;
  }

  $scope.$watch('snippetName', setCodeSnippet);
  $scope.$watch('activeFile', setCodeSnippet);
  $scope.$watch('expanded', setCodeSnippet);
  $scope.$watch('codeSnippet', setHLJSLanguage);
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
  var step = $scope.recipe.recipe_steps[$scope.recipeStepIdx];
  if (step && !step.disable_autorefresh) {
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
      rating: $scope.feedback.rating,
    });
    $scope.feedback.text = '';
    $scope.alert.success = 'Thanks!';
    setTimeout(function() {
      $scope.alert.success = '';
      $scope.$apply();
    }, 2000);
  }
})
