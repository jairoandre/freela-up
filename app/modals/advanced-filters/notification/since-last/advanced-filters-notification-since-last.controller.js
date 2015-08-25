'use strict';

angular
  .module('AdvancedFiltersNotificationSinceLastModalControllerModule', [
    'FormInputSliderRangeComponentModule'
  ])
  .controller('AdvancedFiltersNotificationSinceLastModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {
      values: {
        begin: null,
        end: null
      }
    };

    $scope.save = function() {
      var filter = {
        title: 'Última notificação emitida há',
        desc: $scope.input.values.begin + ' a ' + $scope.input.values.end + ' dias',
        type: 'daysSinceLastNotification',
        value: $scope.input.values
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
