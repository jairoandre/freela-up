'use strict';

angular.module('zupPainelApp')

.controller('UsersCtrl', function ($scope, Users) {

  $scope.loading = true;

  // Get all users
  Users.getAll(function(data) {
    $scope.users = data.users;

    $scope.loading = false;
  });
})

.controller('ViewUsersCtrl', function ($scope, Users, $routeParams) {

  $scope.loading = true;

  // Get specific group
  Users.get({ id: $routeParams.id }, function(data) {
    $scope.user = data.user;

    $scope.loading = false;
  });

});
