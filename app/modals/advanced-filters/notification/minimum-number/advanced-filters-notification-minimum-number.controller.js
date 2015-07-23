'use strict';

angular
  .module('AdvancedFiltersNotificationMinimumNumberModalControllerModule', [])
  .controller('AdvancedFiltersNotificationMinimumNumberModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {};

    $scope.save = function() {
      var filter = {
        title: 'Quantidade mínima',
        desc: $scope.input.value,
        type: 'minimumNotificationNumber',
        value: $scope.input.value
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
