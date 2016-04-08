module.exports = function(opts) {
  if (typeof opts === 'string') opts = {service: opts};
  var enm = {
    path: '/service/' + opts.service + '/action/list',
    method: 'get',
    array: 'objects',
    value: 'id',
    label: 'name',
  }

  if (opts.service === 'uiconf') {
    enm.parameters = [{
      name: 'filter[objTypeEqual]',
      value: 1,
    }]
  }

  return enm;
};

