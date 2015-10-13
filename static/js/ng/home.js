App.controller('Login', function($scope) {
  $scope.responses = {};
  $scope.inputs = [
    {label: 'E-mail', model:"email", type:"text"},
    {label: 'Password', model:"password", type:"password"},
  ]
});

App.controller('Signup', function($scope) {
  $scope.responses = {};
  $scope.inputs = [
    {label: 'First name', model: 'firstName', type: 'text'},
    {label: 'Last name', model: 'lastName', type: 'text'},
    {label: 'E-mail', model:'email', type:'text'},
    {label: 'Country', model:'country', type: 'select', options: COUNTRIES},
    {label: 'How are you planning to use Kaltura', model: 'useage', type: 'textarea'},
    {label: 'Would you like a Kaltura expert to help architect/design a solution with you?',
     model: 'help', type: 'radio', options: ['Yes', 'No']}
  ];

  $scope.$watch('responses.country', function() {
    if ($scope.responses.country === 'United States') {
      $scope.inputs.splice(4, 0, {
        label: 'State', model: 'state', type: 'select', options: STATES
      })
    }
  });

  $scope.submit = function() {
    console.log('responses', $scope.responses);
  }
});
