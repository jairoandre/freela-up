angular
  .module('UserModule', [
    'UserLoginModule',
    'UserLogoutModule'
  ])

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('user', {
      abstract: true,
      url: '/user',
      template: ''
    });

  }]);
