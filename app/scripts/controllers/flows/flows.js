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
            $scope.flow.resolution_states.push(Restangular.stripRestangular(response.data));
          });
        };

        $scope.save = function()
        {
          var putFlowPromise = Restangular.one('flows', flow.id).customPUT($scope.flow);

          putFlowPromise.then(function(response) {
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
});
