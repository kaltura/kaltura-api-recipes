var Router = module.exports = require('express').Router();

Router.get('/recipes', function(req, res) {
  res.redirect('/');
});
Router.get('/console', function(req, res) {
  res.render('console', {});
})

var Schema = require('kaltura-schema');
Schema.initialize(function() {
  var RecipeManager = new (require('../recipes/recipes.js'))({schema: Schema});
  Router.get('/', function(req, res) {
    res.render('home', {recipes: RecipeManager.recipes});
  });
  Router.get('/recipes/:recipe', function(req, res) {
    var recipe = RecipeManager.recipes[req.params.recipe];
    if (!recipe) return res.status(404).send("Sorry, that recipe doesn't exist");

    res.render('recipe', {
      iframeURL: '/recipes_embed/' + req.params.recipe,
      recipe: recipe,
      title: "Kaltura VPaaS Cookbook: " + recipe.title + " Recipe",
    });
  })
});

