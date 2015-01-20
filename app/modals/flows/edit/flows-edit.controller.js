'use strict';

angular
  .module('FlowsEditModalControllerModule', [
    'FlowsResolutionStateComponentModule'
  ])

  .controller('FlowsEditModalController', function($scope, $modalInstance, Restangular, flows, flow) {
    $scope.flow = angular.copy(flow);
    $scope.newResolutionState = {default: false};

    $scope.createResolutionState = function() {
      var postResolutionPromise = Restangular.one('flows', flow.id).post('resolution_states', $scope.newResolutionState);

      postResolutionPromise.then(function(response) {
        $scope.flow.resolution_states.push(Restangular.stripRestangular(response.data)); // jshint ignore:line
      });
    };

    $scope.save = function()
    {
      var putFlowPromise = Restangular.one('flows', flow.id).customPUT($scope.flow);

      putFlowPromise.then(function() {
        if (flows) flows[flows.indexOf(flow)] = $scope.flow;

        $modalInstance.close();
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
