module.exports = function(recipe) {
  var xsd =recipe.steps[0].parameters[5]
  delete xsd.default;
  xsd.hidden = false;
  xsd['x-inputType'] = 'textarea';

  delete recipe.steps[1].parameters[0].default;
  recipe.steps[1].parameters[0].dynamicEnum = require('./enum')('media');
  recipe.steps[1].parameters[3].dynamicValue = {fromStep: 0, value: 'id'};

  recipe.steps[2].description = "Use `metadata.update` to update the metadata for a given item";
  recipe.steps[2].parameters[0].dynamicValue = {fromStep: 1, value: 'id'};

  recipe.steps[3].description = "Use the form below to delete the Metadata you created."
  recipe.steps[3].apiCall = {
    path: '/service/metadata_metadata/action/delete',
    method: 'get',
  };
  recipe.steps[3].parameters[0].dynamicValue = {fromStep: 1, answer: 'objectId'};
  recipe.steps[3].parameters[1].dynamicValue = {fromStep: 0, value: 'id'};
  recipe.steps[3].parameters.unshift({
    name: 'id',
    dynamicValue: {fromStep: 1, value: 'id'},
  });

  recipe.steps[4].description = "Use the form below to delete the Metadata Profile you created";
  recipe.steps[4].apiCall = {
    path: '/service/metadata_metadataprofile/action/delete',
    method: 'get',
  }
  recipe.steps[4].parameters = [{
    name: 'id',
    dynamicValue: {fromStep: 0, value: 'id'},
  }]
}
