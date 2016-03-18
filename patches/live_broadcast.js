module.exports = function(recipe) {
  recipe.steps[1].parameters[0].name = 'liveStreamEntry[name]';
  recipe.steps[1].parameters[1].name = 'liveStreamEntry[description]';
}
