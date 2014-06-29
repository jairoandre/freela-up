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
      windowClass: 'addFlowModal',
      resolve: {
        flows: function() {
          return $scope.flows;
        }
      },
      controller: ['$scope', '$modalInstance', 'flows', function($scope, $modalInstance, flows) {
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
      }]
    });
  };

  $scope.editFlow = function (flow) {
    $modal.open({
      templateUrl: 'views/flows/edit.html',
      windowClass: 'addFlowModal',
      resolve: {
        flows: function() {
          return $scope.flows;
        }
      },
      controller: ['$scope', '$modalInstance', 'flows', function($scope, $modalInstance, flows) {
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
            flows[flows.indexOf(flow)] = $scope.flow;

            $modalInstance.close();
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  $scope.removeFlow = function (flow) {
    $modal.open({
      templateUrl: 'views/flows/remove.html',
      windowClass: 'removeModal',
      resolve: {
        flows: function() {
          return $scope.flows;
        }
      },
      controller: ['$scope', '$modalInstance', 'flows', function($scope, $modalInstance, flows) {
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
      }]
    });
  };
});
