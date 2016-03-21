module.exports = function(recipe) {
  recipe.steps[0].description = [
    "This recipe shows how to work with Kaltura Sessions (aka `KS`).  To generate a" +
        " KS, you will need your API secret keys.",
    "To retrieve these secret keys, visit the \"Integration Settings\" tab inside the" +
        " [Kaltura Management Console](http://kmc.kaltura.com/index.php/kmc/kmc4#account|integration).",
    "To sign up for a Kaltura VPaaS account, visit [vpaas.kaltura.com](https://vpaas.kaltura.com)",
  ];
  recipe.steps[0].apiCall = {
    path: '/service/session/action/start',
    method: 'get',
  }
  delete recipe.steps[0].codeSnippet;
}
