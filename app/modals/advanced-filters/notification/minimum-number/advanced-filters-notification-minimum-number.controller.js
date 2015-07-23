'use strict';

angular
  .module('AdvancedFiltersNotificationMinimumNumberModalControllerModule', [])
  .controller('AdvancedFiltersNotificationMinimumNumberModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.activeAdvancedFilters = activeAdvancedFilters;

    $scope.save = function() {

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
