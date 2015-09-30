var Router = module.exports = require('express').Router();
var Languages = require('lucy-codegen').languages;
var ENABLED_LANGUAGES = ['node', 'javascript', 'ruby', 'php']
ENABLED_LANGUAGES = ENABLED_LANGUAGES.map(function(lang) {
  return {
    id: lang,
    label: Languages[lang].label,
    startServer: Languages[lang].app.startServer({port: 3333, directory: 'path/to/code'})
  }
});
Router.get('/', function(req, res) {
  res.json(ENABLED_LANGUAGES);
})


