var Express = require('express');

var App = Express();
App.set('views', __dirname + '/views')
App.set('view engine', 'jade');
App.engine('jade', require('jade').__express);

App.use('/', Express.static(__dirname + '/static'));

App.use('/recipes', require('./routes/recipes.js'));

App.listen(3000);
