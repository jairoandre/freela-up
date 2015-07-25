'use strict';

angular
  .module('AdvancedFiltersNotificationOverdueModalControllerModule', [
    'FormInputSliderRangeComponentModule'
  ])
  .controller('AdvancedFiltersNotificationOverdueModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {
      values: {
        begin: 0,
        end: 90
      }
    };

    $scope.save = function() {
      //var filter = {
      //  title: 'Última notificação emitida há',
      //  desc: $scope.input.value + ( +($scope.input.value) > 1 ? " dias" : " dia"),
      //  type: 'daysSinceLastNotification',
      //  value: $scope.input.value
      //};
      //
      //activeAdvancedFilters.push(filter);
      //$modalInstance.close();
      console.log($scope.input);
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
