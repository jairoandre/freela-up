'use strict';

angular
  .module('AdvancedFiltersNotificationSinceLastModalControllerModule', [])
  .controller('AdvancedFiltersNotificationSinceLastModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {};

    $scope.save = function() {
      var filter = {
        title: 'Última notificação emitida há',
        desc: $scope.input.value,
        type: 'daysSinceLastNotification',
        value: $scope.input.value
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
