var marked = require('marked');
var Swagger = require('../swagger.js');

var Router = module.exports = require('express').Router();

Object.keys(Swagger.paths).forEach(function(p) {
  var operation = Swagger.paths[p].get;
  var match = p.match(/\/service\/(.*)\/action\/(.*)$/);
  var service = match[1];
  var action = match[2];
  Router.get(p, function(req, res) {
    res.render('discussion', {
      service: service,
      action: action,
      path: p,
      operation: operation,
      description: marked(operation.description),
    })
  })
})
