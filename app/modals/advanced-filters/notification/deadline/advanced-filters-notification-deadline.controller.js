'use strict';

angular
  .module('AdvancedFiltersNotificationDeadlineModalControllerModule', [
    'FormInputSliderRangeComponentModule'
  ])
  .controller('AdvancedFiltersNotificationDeadlineModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {
      values: {
        begin: null,
        end: null
      }
    };

    $scope.save = function() {
      var filter = {
        title: 'Vencimento da última notificação',
        desc: $scope.input.values.begin + ' a ' + $scope.input.values.end + ' dias',
        type: 'daysForLastNotificationDeadline',
        value: $scope.input.values
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
