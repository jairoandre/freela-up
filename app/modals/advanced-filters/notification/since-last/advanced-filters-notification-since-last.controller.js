'use strict';

angular
  .module('AdvancedFiltersNotificationSinceLastModalControllerModule', [
    'FormInputSliderComponentModule'
  ])
  .controller('AdvancedFiltersNotificationSinceLastModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {};

    $scope.save = function() {
      var filter = {
        title: 'Última notificação emitida há',
        desc: $scope.input.value + ( +($scope.input.value) > 1 ? " dias" : " dia"),
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
