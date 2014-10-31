'use strict';

angular
  .module('AdvancedFiltersShareModalControllerModule', [])
  .controller('AdvancedFiltersShareModalController', function($scope, $modalInstance, $q, url) {
    $scope.url = url;

    $scope.close = function() {
      $modalInstance.close();
    };
  });
