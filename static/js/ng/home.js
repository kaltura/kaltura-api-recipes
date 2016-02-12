
$(document).ready(function(){
    $('[data-toggle=tooltip]').hover(function(){
        // on mouseenter
        $(this).tooltip('show');
    }, function(){
        // on mouseleave
        $(this).tooltip('hide');
    });
});

App.controller('Recipes', function($scope) {
  $scope.recipes = RECIPES;

  $scope.sortOptions = ['Name', 'Date Added'];
  $scope.filterOptions = $scope.recipes.map(function(r) {
    return (r.keywords || [])[0]
  }).filter(function(k) {return k});

  $scope.recipeFilter = function(recipe) {
    if (!$scope.filterOptions.active) return true;
    if (!recipe.keywords || !recipe.keywords[0]) return false;
    var keyword = recipe.keywords[0].toLowerCase();
    return $scope.filterOptions.active.toLowerCase() === keyword;
  }

  $scope.recipeSort = function(recipe) {
    var sortOpt = $scope.sortOptions.active || 'Name';
    if (sortOpt === 'Name') return recipe.title;
    if (sortOpt === 'Description') return recipe.description;
    if (sortOpt === 'Date Added') return recipe.dateAdded;
  }
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
