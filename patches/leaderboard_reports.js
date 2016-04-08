module.exports = function(recipe) {
  var pager = {
    name: 'pager[pageSize]', 'x-consoleDefault': 10, hidden: true,
  };

  recipe.steps[0].parameters.push(pager);
  recipe.steps[1].parameters.push(pager);
  recipe.steps[0].parameters[2].default = recipe.steps[1].parameters[2].default = '20150101';
  recipe.steps[0].parameters[3].default = recipe.steps[1].parameters[3].default = '20160101';
}
