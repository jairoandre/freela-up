'use strict';

angular
  .module('AdvancedFiltersNotificationDeadlineModalControllerModule', [])
  .controller('AdvancedFiltersNotificationDeadlineModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.activeAdvancedFilters = activeAdvancedFilters;

    $scope.save = function() {

      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
