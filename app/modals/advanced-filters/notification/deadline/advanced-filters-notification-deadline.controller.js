'use strict';

angular
  .module('AdvancedFiltersNotificationDeadlineModalControllerModule', [])
  .controller('AdvancedFiltersNotificationDeadlineModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {};

    $scope.save = function() {
      var filter = {
        title: 'Vencimento da última notificação',
        desc: $scope.input.value + ( +($scope.input.value) > 1 ? " dias restantes" : " dia restante"),
        type: 'daysForLastNotificationDeadline',
        value: $scope.input.value
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
