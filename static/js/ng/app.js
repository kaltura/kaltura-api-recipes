var App = angular.module('App', ['localytics.directives']);
App.controller('Recipes', function($scope) {
  $scope.recipes = RECIPES;
})

