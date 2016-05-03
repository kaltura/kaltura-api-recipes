var Express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');

var LucyPortal = require('lucy-api-portal').PortalRouter;
var Swagger = require('./swagger/swagger.js');
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
  App.use('/fonts',          cache('long'));
  App.use('/img',            cache('long'));
  App.use('/kaltura_static', cache('med'));
  App.use('/minified',       cache('med'));
  App.use('/partials',       cache('med'));
  App.use('/swagger.js',     cache('med'));
  App.use('/swagger.json',   cache('med'));
}
App.use('/kaltura_static', Express.static(__dirname + '/static'));
App.use('/img', Express.static(__dirname + '/img'));

App.use('/auth', require('./routes/partner-auth.js'));
App.use('/github', require('./routes/github.js'));

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
var footerFile = __dirname + '/views/generated/footer.html';

var cid = assetMan.options.cacheID || '';
var cacheBust = file => file + '?cacheID=' + cid;

var apiPortal = LucyPortal({
  swagger: Swagger,
  defaultPage: 'documentation',
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
  footerHTML: fs.readFileSync(footerFile, 'utf8'),
  disableAutorefresh: true,
  allowUnsanitizedMarkdown: true,
  development: process.env.DEVELOPMENT || false,
  credentialCookie: 'LUCYBOT_RECIPE_CREDS',
  embedParameters: {
    format: 1,
  },
  recipes: recipes,
  saveRecipe: require('./recipes-v2').save,
  paths: {
    documentation: 'api-docs',
  },
  env: {
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
    sampleCodeSetup: true,
  },
})

if (process.env.DEVELOPMENT) {
  App.use('/recipes/:recipe', function(req, res, next) {
    require('./recipes-v2').reload();
    apiPortal.reloadRecipes();
    next();
  });
}

require('./routes/codegen').initialize(function(router) {
  App.use(router);
  App.get('/client_libraries', function(req, res) {
    res.redirect('/api-docs/#/Client%20Libraries');
  });
  App.use(apiPortal);
  App.use(Express.static(__dirname + '/static'));
})

App.get('/swagger.json', function(req, res) {
  res.json(Swagger);
})

var sitemapUrls = Object.keys(recipes).map(function(r) {
  return {url: '/recipes/' + r, priority: .3}
});
sitemapUrls.push({url: '/readme',        priority: .9})
sitemapUrls.push({url: '/api-docs', priority: .9})
sitemapUrls.push({url: '/console',       priority: .9})
sitemapUrls.push({url: '/recipes',       priority: .9})
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

if (process.env.DEVELOPMENT || process.env.NO_SSL) {
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
