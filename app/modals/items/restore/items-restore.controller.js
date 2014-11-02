'use strict';

angular
  .module('ItemsRestoreModalControllerModule', [])

  .controller('ItemsRestoreModalController', function($scope, $modalInstance, setItemData) {
    $scope.restore = function() {
      setItemData();

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
