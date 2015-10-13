var COOKIE_TIMEOUT_MS = 900000;
var STORAGE_KEY = 'LUCYBOT_RECIPE_CREDS';

App.controller('LoginBar', function($scope) {
  $scope.user = {};
  $scope.setUser = function(creds) {
    $scope.user = creds;
    var now = new Date();
    var expires = new Date(now.getTime() + COOKIE_TIMEOUT_MS);
    var cookie = STORAGE_KEY + '=' + JSON.stringify(creds) + '; expires=' + expires.toUTCString() + '; Path=/';
    document.cookie = cookie;
  }
})

App.controller('Login', function($scope) {
  $scope.responses = {};
  $scope.inputs = [
    {label: 'E-mail', model:"email", type:"text"},
    {label: 'Password', model:"password", type:"password"},
  ]
});

App.controller('Signup', function($scope) {
  $scope.responses = {};
  $scope.alert = {};
  $scope.inputs = [
    {label: 'First name', model: 'firstName', type: 'text', required: true},
    {label: 'Last name', model: 'lastName', type: 'text', required: true},
    {label: 'Company', model: 'company', type: 'text', required: true},
    {label: 'E-mail', model:'email', type:'email', required: true},
    {label: 'Country', model:'country', type: 'select', options: COUNTRIES},
    {label: 'How are you planning to use Kaltura', model: 'useage', type: 'textarea'},
    {label: 'Would you like a Kaltura expert to help architect/design a solution with you?',
     model: 'help', type: 'radio', options: ['Yes', 'No']}
  ];

  $scope.$watch('responses.country', function() {
    if ($scope.responses.country === 'US') {
      $scope.inputs.splice(5, 0, {
        label: 'State', model: 'state', type: 'select', options: STATES
      })
    }
  });

  $scope.submit = function() {
    $scope.alert = {};
    $scope.loading = true;
    $.ajax({
      url: '/auth/signup',
      method: 'POST',
      data: JSON.stringify($scope.responses),
      headers: {'Content-Type': 'application/json'},
    })
    .done(function(response) {
      var creds = {
        partnerId: response.id,
        userId: response.adminUserId,
        secret: response.adminSecret,
      }
      $scope.setUser(creds);
      $scope.alert = {success: "You're ready to go!"};
      setTimeout(function() {
        $scope.alert = {};
        $('#Signup').modal('hide');
      }, 1500);
    })
    .fail(function() {
      $scope.alert = {danger: "Error creating account"}
    })
    .always(function() {
      $scope.loading = false;
      $scope.$apply();
    })
  }
});
