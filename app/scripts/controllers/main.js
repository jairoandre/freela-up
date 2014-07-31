'use strict';

angular.module('zupPainelApp')

.controller('MainCtrl', function (User, Error, $scope, $location, Auth) {

  var token = Auth.getToken();

  if (token !== null)
  {
    $location.path('/reports');
  }

  $scope.login = function() {
    $scope.loginError = false;

    var user = new User($scope.email, $scope.password);

    user.auth().then(function() {
      $location.path('/reports');
    }, function(response) {
      if (response.status === 400 || response.status === 401)
      {
        $scope.loginError = true;
      }
    });
  };
})

.controller('LogoutCtrl', function ($location, Auth) {

  Auth.logout();
  $location.path('/');

});
