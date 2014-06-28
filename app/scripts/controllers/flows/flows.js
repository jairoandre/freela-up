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
});
