var Express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');

var LucyPortal = require('lucy-api-portal').PortalRouter;
var Swagger = require('./swagger.js');
var RecipeManager = require('./recipes/recipes.js');
var assetMan = require('./asset-man');

var App = Express();
App.use(require('compression')());
App.set('views', __dirname + '/views')
App.set('view engine', 'jade');
App.engine('jade', require('jade').__express);
App.use(require('body-parser').json());

if (process.env.USE_BASIC_AUTH && process.env.LUCYBOT_USERNAME && process.env.LUCYBOT_PASSWD) {
  App.use(require('./routes/basic-auth.js'));
}

var cache = function(req, res, next) {
  var maxAge = 60*60;
  res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
  next();
};

if (!process.env.DEVELOPMENT) {
  App.use('/js', cache);
  App.use('/css', cache);
  App.use('/fonts', cache);
  App.use('/img', cache);
  App.use('/minified', cache);
  App.use('/portal_embed/minified', cache);
  App.use('/portal_embed/swagger.js', cache);
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

var recipes = require('./recipes-v2');

var cid = assetMan.options.cacheID || '';
var apiPortal = LucyPortal({
  swagger: Swagger,
  basePath: '/portal_embed',
  cacheID: cid,
  linkBase: '/portal',
  bootstrap: '/css/bootstrap.css',
  cssIncludes: [
    '/css/portal.css?cacheID=' + cid,
  ],
  jsIncludes: [
    '/minified/js/kaltura.js?cacheID=' + cid,
    '/minified/js/includes.js?cacheID=' + cid,
  ],
  showTopLevelNav: false,
  disableAutorefresh: true,
  development: process.env.DEVELOPMENT || false,
  credentialCookie: 'LUCYBOT_RECIPE_CREDS',
  embedParameters: {
    format: 1,
  },
  recipes: recipes,
})

App.get('/', function(req, res) {
  res.redirect('/portal/recipes');
})

require('./codegen').initialize(function(router) {
  App.use('/portal_embed', router);
  App.use('/portal_embed', apiPortal);
})

App.get('/portal/recipes/:recipe_name', function(req, res) {
  res.render('embed', {page: '/recipes/' + req.params.recipe_name, assetMan: assetMan})
})
App.get('/portal/:page', function(req, res) {
  res.render('embed', {page: req.params.page, assetMan: assetMan})
})

App.get('/swagger.json', function(req, res) {
  res.json(Swagger);
})

var sitemapUrls = Object.keys(recipes).map(function(r) {
  return {url: '/portal/recipes/' + r, priority: .3}
});
sitemapUrls.push({url: '/portal/readme',        priority: .9})
sitemapUrls.push({url: '/portal/documentation', priority: .9})
sitemapUrls.push({url: '/portal/console',       priority: .9})
sitemapUrls.push({url: '/portal/recipes',       priority: .9})
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
