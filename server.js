var Express = require('express');

var App = Express();
App.set('views', __dirname + '/views')
App.set('view engine', 'jade');
App.engine('jade', require('jade').__express);

App.use('/', Express.static(__dirname + '/static'));

require('./recipe-server.js').getRouter(function(router) {
  App.use('/recipes', router);

  if (process.env.LUCYBOT_DEV) {
      console.log('----DEVELOPMENT ENVIRONMENT----');
      App.listen(process.env.KALTURA_RECIPES_PORT || 3000);
  } else {
      var port=process.env.KALTURA_RECIPES_PORT || 443
      var https = require('https'),
      fs = require('fs');
      var sslOptions = {
      key: fs.readFileSync('/etc/ssl/certs/kaltura.org.key'),
      cert: fs.readFileSync('/etc/ssl/certs/kaltura.org.crt'),
      ca: fs.readFileSync('/etc/ssl/certs/ca-kaltura.org.crt'),
      requestCert: true,
      rejectUnauthorized: false
      };
      var secureServer = https.createServer(sslOptions,App).listen(port, function(){
      console.log("Secure Express server listening on port "+port);
      });
      // Redirect from http port 80 to https
      var http = require('http');
      http.createServer(function (req, res) {
          res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
          res.end();
      }).listen(80);
  }
});
