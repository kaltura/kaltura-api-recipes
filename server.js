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

var cache = function(age) {
  age = age || 'med';
  if (age === 'short') age = 60 * 60;
  if (age === 'med')   age = 60 * 60 * 24;
  if (age === 'long')  age = 60 * 60 * 24 * 30;
  return function(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=' + age);
    next();
  };
}
if (!process.env.DEVELOPMENT) {
  App.use(cache('short'));
  App.use('/fonts', cache('long'));
  App.use('/img', cache('long'));
  App.use('/minified', cache());
  App.use('/swagger.js', cache());
  App.use('/swagger.json', cache());
}
App.use('/kaltura_static', Express.static(__dirname + '/static'));
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

var recipes = require('./recipes-v2').recipes;
var navbarFile = __dirname + '/views/includes/navbar.jade';

var cid = assetMan.options.cacheID || '';
var cacheBust = file => file + '?cacheID=' + cid;

var apiPortal = LucyPortal({
  swagger: Swagger,
  defaultPage: 'readme',
  cacheID: cid,
  bootstrap: '/kaltura_static/css/bootstrap.css',
  cssIncludes: [
    '/kaltura_static/minified/css/includes.css',
  ].map(cacheBust),
  jsIncludes: [
    '/kaltura_static/minified/js/kaltura.js',
    '/kaltura_static/minified/js/includes.js',
  ].map(cacheBust),
  navbarHTML: require('jade').compile(fs.readFileSync(navbarFile, 'utf8'), {filename: navbarFile})(),
  disableAutorefresh: true,
  development: process.env.DEVELOPMENT || false,
  credentialCookie: 'LUCYBOT_RECIPE_CREDS',
  embedParameters: {
    format: 1,
  },
  recipes: recipes,
  saveRecipe: process.env.DEVELOPMENT ? require('./recipes-v2').save : null,
})

require('./codegen').initialize(function(router) {
  App.use(router);
  App.use(apiPortal);
})

if (process.env.DEVELOPMENT) {
  App.use('/portal/recipes/:recipe', function(req, res, next) {
    require('./recipes-v2').reload();
    apiPortal.reloadRecipes();
    next();
  });
}

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
