'use strict';

angular
  .module('ErrorModalControllerModule', [])

  .controller('ErrorModalController', function($scope, $modalInstance, $state, response, Raven, Auth) {
    $scope.response = response;

    Raven.captureMessage(JSON.stringify(response));

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.redoSession = function() {
      Auth.logout();
      $state.go('user.login');

      $modalInstance.close();
    };
  });
