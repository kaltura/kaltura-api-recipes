module.exports = function(recipe) {
  recipe.steps[0].parameters.push({
    name: 'filter[advancedSearch][objectType]',
    default: '',
    hidden: true,
  })
  return recipe;
}
