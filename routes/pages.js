var Router = module.exports = require('express').Router();
var Recipes = require('../recipes/recipes.js');

Router.get('/', function(req, res) {
  res.render('home', {recipes: Recipes});
});

Router.get('/recipes', function(req, res) {
  res.redirect('/');
});

Router.get('/recipes/:recipe', function(req, res) {
  res.render('recipe', {iframeURL: '/recipes_embed/' + req.params.recipe});
})
