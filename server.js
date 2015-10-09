var Express = require('express');

var App = Express();


if (process.env.USE_BASIC_AUTH && process.env.LUCYBOT_USERNAME && process.env.LUCYBOT_PASSWD) {

// Authenticator
        App.use(function(req, res, next) {
            var auth;

            // check whether an autorization header was send    
            if (req.headers.authorization) {
              // only accepting basic auth, so:
              // * cut the starting "Basic " from the header
              // * decode the base64 encoded username:password
              // * split the string at the colon
              // -> should result in an array
              auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
            }

            // checks if:
            // * auth array exists 
            // * first value matches the expected user 
            // * second value the expected password
            if (!auth || auth[0] !== process.env.LUCYBOT_USERNAME || auth[1] !== process.env.LUCYBOT_PASSWD) {
                // any of the tests failed
                // send an Basic Auth request (HTTP Code: 401 Unauthorized)
                res.statusCode = 401;
                // MyRealmName can be changed to anything, will be prompted to the user
                res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
                // this will displayed in the browser when authorization is cancelled
                res.end('Unauthorized');
            } else {
                // continue with processing, user was authenticated
                next();
            }
        });
}
App.use('/', Express.static(__dirname + '/static'));


App.get('/', function(req, res) {
  res.redirect('/recipes');
})

require('./routes/recipes.js').getRouter(function(router) {
  App.use('/recipes', router);
  App.use('/', require('./routes/pages.js'));

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
