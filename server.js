var Express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');

var LucyPortal = require('lucy-api-portal').PortalRouter;
var Swagger = require('./swagger.js');
var RecipeManager = require('./recipes/recipes.js');

var App = Express();
App.set('views', __dirname + '/views')
App.set('view engine', 'jade');
App.engine('jade', require('jade').__express);
App.use(require('body-parser').json());

if (process.env.USE_BASIC_AUTH && process.env.LUCYBOT_USERNAME && process.env.LUCYBOT_PASSWD) {
  App.use(require('./routes/basic-auth.js'));
}

App.use('/', Express.static(__dirname + '/static'));
App.use('/img', Express.static(__dirname + '/img'));

App.use('/auth', require('./routes/partner-auth.js'));

if (process.env.DEVELOPMENT) {
  App.use('/strapping', require('strapping')({
    basePath: '/strapping',
    output: {
      styles: __dirname + '/static/css/bootstrap.css',
      settings: __dirname + '/static/css/config.json',
    }
  }))
}

var apiPortal = LucyPortal({
  swagger: Swagger,
  mixpanel: '/js/includes/mixpanel.js',
  cssIncludes: [
    '/css/bootstrap.css',
    '/css/console.css',
    '/css/navbar.css',
  ],
  jsIncludes: [
    '/js/kaltura/ox.ajast.js',
    '/js/kaltura/webtoolkit.md5.js',
    '/js/kaltura/KalturaClientBase.js',
    '/js/kaltura/KalturaTypes.js',
    '/js/kaltura/KalturaVO.js',
    '/js/kaltura/KalturaServices.js',
    '/js/kaltura/KalturaClient.js',
    '/js/includes/kc-setup.js',
    '/js/includes/console.js',
  ],
  disableAutorefresh: true,
  development: process.env.DEVELOPMENT || false,
  credentialCookie: 'LUCYBOT_RECIPE_CREDS',
  embedParameters: {
    format: 1,
  },
  directory: __dirname + '/recipes-v2',
})
require('./codegen').initialize(function(router) {
  App.use(router);
  App.use(apiPortal);
})

App.get('/swagger.json', function(req, res) {
  res.json(Swagger);
})

var recipes = new RecipeManager();
var sitemapUrls = Object.keys(recipes.recipes).map(function(r) {
  return {url: '/recipes/' + r, priority: .3}
});
sitemapUrls.push({url: '/', priority: .9})
var sitemap = require('sitemap').createSitemap({
  hostname: 'https://developer.kaltura.org',
  cacheTime: 1000 * 60 * 10, // ten minutes
  urls: sitemapUrls,
});
App.use('/sitemap.xml', function(req, res) {
  sitemap.toXML(function(err, xml) {
    if (err) return res.status(500).send(err);
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  })
})

App.use('/discussion', require('./routes/discussion.js'))

if (process.env.LUCYBOT_DEV) {
  console.log('----DEVELOPMENT ENVIRONMENT----');
  var port = process.env.KALTURA_RECIPES_PORT || 3000;
  console.log('listening on port ' + port);
  App.listen(port);
} else {
  var port = process.env.KALTURA_RECIPES_PORT || 443
  var sslOptions = {
    key: fs.readFileSync('/etc/ssl/certs/kaltura.org.key'),
    cert: fs.readFileSync('/etc/ssl/certs/kaltura.org.crt'),
    ca: fs.readFileSync('/etc/ssl/certs/ca-kaltura.org.crt'),
    requestCert: true,
    rejectUnauthorized: false
  };
  var secureServer = https.createServer(sslOptions, App).listen(port, function(){
    console.log("Secure Express server listening on port "+port);
  });
  // Redirect from http port 80 to https
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80);
}
