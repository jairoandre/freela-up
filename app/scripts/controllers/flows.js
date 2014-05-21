'use strict';

angular.module('zupPainelApp')

.controller('FlowsCtrl', function ($scope, Restangular, $modal, $q) {
  $scope.loading = false;
  $scope.loadingPagination = false;
  $scope.loadingContent = false;

  var page = 1, perPage = 30, total;

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