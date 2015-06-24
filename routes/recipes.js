var Router = module.exports = require('express').Router();

var Recipes = require('../recipes.js');

Router.use('/:recipe', function(req, res, next) {
  if (!Recipes[req.params.recipe]) return res.status(404).send('Recipe ' + req.params.recipe + ' not found.');
  else next();
})

Router.get('/:recipe', function(req, res) {
  res.render('recipe', {recipe: Recipes[req.params.recipe]});
});

Router.post('/:recipe/code', function(req, res) {
  res.send('not impl');
});

Router.get('/:recipe/embed', function(req, res) {
  res.send('not impl');
});
