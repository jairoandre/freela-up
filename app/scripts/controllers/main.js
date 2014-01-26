'use strict';

angular.module('zupPainelApp')

.controller('MainCtrl', function (User, Error, $scope, $location, Auth) {

  var token = Auth.getToken();

  if (token !== null)
  {
    $location.path('/reports');
  }

  $scope.login = function() {
    var user = new User($scope.email, $scope.password);

    user.auth().then(function() {
      $location.path('/reports');
    }, function(response) {
      console.log('got', response);
    });
  };
});
