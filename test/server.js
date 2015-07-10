var Express = require('express');

var App = Express();

App.use('/recipes', require('../routes/recipes.js'));

module.exports = {
  listen: function(port) {
    App.listen(port);
  }
}
