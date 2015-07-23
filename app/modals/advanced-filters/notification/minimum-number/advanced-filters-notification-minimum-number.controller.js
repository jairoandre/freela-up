'use strict';

angular
  .module('AdvancedFiltersNotificationMinimumNumberModalControllerModule', [])
  .controller('AdvancedFiltersNotificationMinimumNumberModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {};

    $scope.save = function() {
      var filter = {
        title: 'Quantidade mínima',
        desc: $scope.input.minimum_number,
        type: 'minimumNotificationNumber',
        value: $scope.input.minimum_number
      };

      activeAdvancedFilters.push(filter);
      $modalInstance.close();
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
