'use strict';

angular
  .module('AdvancedFiltersNotificationOverdueModalControllerModule', [])
  .controller('AdvancedFiltersNotificationOverdueModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.activeAdvancedFilters = activeAdvancedFilters;

    $scope.save = function() {

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
