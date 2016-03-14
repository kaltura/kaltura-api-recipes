module.exports = function(recipe) {
  recipe.steps[1].description[2] = "Which type would you like to work with?";
  recipe.steps[3].parameters = [
    {name: 'id', dynamicValue: {fromStep: 2, value: 'id'}},
  ]
}
