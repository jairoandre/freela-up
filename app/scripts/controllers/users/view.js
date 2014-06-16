'use strict';

angular.module('zupPainelApp')

.controller('UsersViewCtrl', function ($scope, Restangular, $routeParams, $modal, $location) {
  $scope.loading = true;

  Restangular.one('users', $routeParams.id).get().then(function(response) {
    $scope.user = response.data;

    $scope.loading = false;
  });

  $scope.deleteUser = function (user) {
    $modal.open({
      templateUrl: 'views/users/removeUser.html',
      windowClass: 'removeModal',
      controller: ['$scope', '$modalInstance', 'Users', function($scope, $modalInstance, Users) {
        $scope.user = user;

        // delete user from server
        $scope.confirm = function() {
          var user = Users.get({ id: $scope.user.id }, function() {
            user.$delete({ id: $scope.user.id }, function() {
              $modalInstance.close();

              // remove user from list
              $location.path('/users');
            });
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
});
