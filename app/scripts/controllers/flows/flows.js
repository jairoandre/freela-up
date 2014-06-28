'use strict';

angular.module('zupPainelApp')

.controller('FlowsCtrl', function ($scope, Restangular, $modal) {

  $scope.loading = true;

  var flowsPromise = Restangular.all('flows').getList({'display_type': 'full'});

  flowsPromise.then(function(response) {
    $scope.loading = false;

    $scope.flows = response.data;
  });

  $scope.addFlow = function () {
    $modal.open({
      templateUrl: 'views/flows/add.html',
      windowClass: 'addFlowModal'
    });
  };
});
