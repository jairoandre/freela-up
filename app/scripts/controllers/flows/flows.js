'use strict';

angular.module('zupPainelApp')

.controller('FlowsCtrl', function ($scope, Restangular, $modal) {
  $scope.loading = false;
  $scope.loadingPagination = false;
  $scope.loadingContent = false;

  $scope.addFlow = function () {
    $modal.open({
      templateUrl: 'views/flows/addFlow.html',
      windowClass: 'addFlowModal'
    });
  };

  $scope.editStep = function () {
    $modal.open({
      templateUrl: 'views/flows/editStep.html',
      windowClass: 'editStepModal'
    });
  };

  $scope.addStep = function () {
    $modal.open({
      templateUrl: 'views/flows/addStep.html',
      windowClass: 'editStepModal'
    });
  };
});
