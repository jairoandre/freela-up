'use strict';

angular
  .module('FlowsAddModalControllerModule', [])

  .controller('FlowsAddModalController', function($scope, $modalInstance, Restangular, flows) {
    $scope.flow = {};

    $scope.save = function()
    {
      var postFlowPromise = Restangular.all('flows').post($scope.flow);

      postFlowPromise.then(function(response) {
        flows.push(Restangular.stripRestangular(response.data));

        $modalInstance.close();
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
