var App = angular.module('App', ['localytics.directives']);

App.controller('Recipes', function($scope) {
  $scope.recipes = RECIPES;
})

App.controller('Suggestion', function($scope) {
  $scope.sendSuggestion = function() {
    mixpanel.track('suggestion', {
      text: $scope.suggestion,
    })
    $scope.success = true;
    setTimeout(function() {
      $scope.success = false;
      $scope.$apply();
    }, 2000)
  }
})
