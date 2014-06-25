'use strict';

angular.module('zupPainelApp')

.controller('FlowsCtrl', function ($scope, Restangular, $modal) {

  $scope.loading = true;

  var flowsPromise = Restangular.all('flows').getList({'display_type': 'full'});

  flowsPromise.then(function(response) {
    $scope.loading = false;

    $scope.flows = response.data;

    console.log(Restangular.stripRestangular($scope.flows));
  });

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
