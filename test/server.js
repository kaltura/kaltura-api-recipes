var Express = require('express');

var App = Express();

module.exports = {
  listen: function(port, callback) {
    require('../recipe-server.js').getRouter(function(router) {
      App.use('/recipes', router);
      App.listen(port);
    });
  }
}
