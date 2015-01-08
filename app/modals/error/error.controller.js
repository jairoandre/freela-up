'use strict';

angular
  .module('ErrorModalControllerModule', [])

  .controller('ErrorModalController', function($scope, response) {
    $scope.response = response;

    $scope.ok = function () {
      window.location.reload();
    };
  });
