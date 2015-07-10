var Router = module.exports = require('express').Router();
var Recipes = require('../recipes/recipes.js');

Router.get('/', function(req, res) {
  res.render('home', {recipes: Recipes});
});
