'use strict';

angular
  .module('AdvancedFiltersNotificationOverdueModalControllerModule', [
    'FormInputSliderRangeComponentModule'
  ])
  .controller('AdvancedFiltersNotificationOverdueModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {
      values: {
        begin: null,
        end: null
      }
    };

    $scope.save = function() {
      var filter = {
        title: 'Notificações vencidas',
        desc: $scope.input.values.begin + ' a ' + $scope.input.values.end + ' dias',
        type: 'daysForOverdueNotification',
        value: $scope.input.values
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
