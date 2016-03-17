module.exports = function(opts) {
  if (typeof opts === 'string') opts = {service: opts};
  return {
    path: '/service/' + opts.service + '/action/list',
    method: 'get',
    array: 'objects',
    value: 'id',
    label: 'name',
  }
};

