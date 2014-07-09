'use strict';

angular.module('zupPainelApp')

.controller('CasesCtrl', function ($scope, Restangular, $modal) {
  $scope.currentTab = 'progress';

  $scope.selectConductor = function () {
    $modal.open({
      templateUrl: 'views/cases/selectConductor.html',
      windowClass: 'modalConductor'
    });
  };

  $scope.changeConductor = function () {
    $modal.open({
      templateUrl: 'views/cases/changeConductor.html',
      windowClass: 'modalConductor'
    });
  };
});
