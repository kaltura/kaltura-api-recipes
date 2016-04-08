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

  recipe.steps.push({
    title: 'Logging in with your Login ID',
    description: [
      "You can also log in with your Login ID and password by using `user.loginByLoginId`. This will return a new KS."
    ],
    apiCall: {
      path: '/service/user/action/loginByLoginId',
      method: 'get',
    },
    parameters: [
      {name: 'loginId'},
      {name: 'password', 'x-inputType': 'password'},
    ]
  });

  recipe.steps.push({
    title: "Log In with a Partner ID",
    description: [
      "After using `user.loginByLoginId`, you can get a list of all your Partner IDs for that account using `partner.listPartnersForUser`.",
      "You can then re-use `user.loginById` with a partnerId to login for as that particular partner.",
    ],
    apiCall: {
      path: '/service/partner/action/listPartnersForUser',
      method: 'get',
    },
  });
}
