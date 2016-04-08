module.exports = function(recipe) {
  var listDesc = recipe.steps[0].description;
  var addDesc = recipe.steps[1].description;
  require('./crud')(recipe, {
    name: 'App Token',
    service: 'appToken',
    serviceName: 'apptoken',
  })
  recipe.steps[0].description = listDesc;
  recipe.steps[1].description = addDesc;
}
