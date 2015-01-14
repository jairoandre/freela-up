'use strict';

angular
  .module('FlowsDestroyModalControllerModule', [])

  .controller('FlowsDestroyModalController', function($scope, $modalInstance, Restangular, flow, flows) {
    $scope.flow = flow;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = Restangular.one('flows', flow.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();

        // remove flow from list
        flows.splice(flows.indexOf($scope.flow), 1);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
