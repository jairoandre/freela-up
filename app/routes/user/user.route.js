angular
  .module('UserModule', [
    'UserLoginModule',
    'UserLogoutModule',
    'UserUnauthorizedModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('user', {
      abstract: true,
      url: '/user',
      template: ''
    });

  }]);
