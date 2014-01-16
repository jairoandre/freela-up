'use strict';

angular.module('zupPainelApp')

.controller('MainCtrl', function (User, Error, $scope, $location) {
  $scope.login = function() {
    var user = new User($scope.email, $scope.password);

    user.auth().then(function() {
      $location.path('/reports');
    }, function(response) {
      Error.showDetails(response);
    });
  };
});
