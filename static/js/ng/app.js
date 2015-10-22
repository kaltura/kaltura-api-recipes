var App = angular.module('App', []);
App.controller('Recipes', function($scope) {
  $scope.recipes = $scope.matchingRecipes = RECIPES;
  $scope.$watch('query', function(q) {
    if (q) {
      q = q.toLowerCase();
      $scope.matchingRecipes = $scope.recipes.filter(function(r) {
        return r.title.toLowerCase().indexOf(q) !== -1 ||
               r.description.toLowerCase().indexOf(q) !== -1
      })
    } else {
      $scope.matchingRecipes = $scope.recipes;
    }
  })
})

