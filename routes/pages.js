var Router = module.exports = require('express').Router();
var RecipeManager = require('../recipes/recipes.js');

Router.get('/', function(req, res) {
  res.render('home', {recipes: RecipeManager.recipes});
});

Router.get('/recipes', function(req, res) {
  res.redirect('/');
});

Router.get('/recipes/:recipe', function(req, res) {
  if (!RecipeManager.recipes[req.params.recipe]) return res.status(404).send("Sorry, that recipe doesn't exist");
  res.render('recipe', {iframeURL: '/recipes_embed/' + req.params.recipe, recipe: RecipeManager.recipes[req.params.recipe]});
})
