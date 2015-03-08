'use strict';

angular
  .module('ErrorModalControllerModule', [])

  .controller('ErrorModalController', function($scope, $modalInstance, response, Raven) {
    $scope.response = response;

    Raven.captureMessage(JSON.stringify(response));

    $scope.ok = function () {
      $modalInstance.close();
    };
  });
