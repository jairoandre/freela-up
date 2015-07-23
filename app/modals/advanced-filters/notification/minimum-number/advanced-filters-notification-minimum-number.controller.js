'use strict';

angular
  .module('AdvancedFiltersNotificationMinimumNumberModalControllerModule', [])
  .controller('AdvancedFiltersNotificationMinimumNumberModalController', function(Restangular, $scope, $modalInstance, activeAdvancedFilters) {
    $scope.input = {
      value: null
    };

    $scope.save = function() {

      var filter = {
        title: 'Quantidade mínima',
        desc: +($scope.input.value) > 0 ? 'dias' : 'dia',
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
