'use strict';

angular
  .module('ErrorModalControllerModule', [])

  .controller('ErrorModalController', function($scope, $modalInstance, response) {
    $scope.response = response;

    $scope.ok = function () {
      $modalInstance.close();
    };
  });
