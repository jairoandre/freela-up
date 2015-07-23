'use strict';

angular
  .module('AdvancedFiltersNotificationSinceLastModalControllerModule', [])
  .controller('AdvancedFiltersNotificationSinceLastModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.activeAdvancedFilters = activeAdvancedFilters;

    $scope.save = function() {

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
