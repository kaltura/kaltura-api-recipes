var VOWELS = ['a', 'e', 'i', 'o', 'u'];
module.exports = function(recipe, opts) {
  var isVowel = VOWELS.indexOf(opts.name.charAt(0).toLowerCase() !== -1);
  var article = isVowel ? ' an ' : ' a ';

  recipe.steps[0] = {
    title: 'Getting ' + opts.name + 's',
    description: 'Use `' + opts.service + '.list` to retrieve a list of ' + opts.name + 's',
    apiCall: {
      path: '/service/' + opts.serviceName + '/action/list',
      method: 'get',
    }
  }
  recipe.steps[1] = {
    title: 'Adding a new ' + opts.name,
    description: 'Use `' + opts.service + '.add` to create a new ' + opts.name,
    apiCall: {
      path: '/service/' + opts.serviceName + '/action/add',
      method: 'get',
    }
  }
  recipe.steps[2] = {
    title: 'Retrieving' + article + opts.name,
    description: 'Use `' + opts.service + '.get` to get details for a specific ' + opts.name,
    apiCall: {
      path: '/service/' + opts.serviceName + '/action/get',
      method: 'get',
    },
    parameters: [
      {name: 'id', dynamicValue: {fromStep: 1, value: 'id'}},
    ],
  }
  recipe.steps[3] = {
    title: 'Deleting' + article + opts.name,
    description: 'Use `' + opts.service + '.delete` to remove a specific ' + opts.name,
    apiCall: {
      path: '/service/' + opts.serviceName + '/action/delete',
      method: 'get',
    },
    parameters: [
      {name: 'id', dynamicValue: {fromStep: 1, value: 'id'}},
    ],
  }
}
