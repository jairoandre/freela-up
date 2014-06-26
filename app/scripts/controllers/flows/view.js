'use strict';

angular.module('zupPainelApp')

.controller('FlowsViewCtrl', function ($scope, Restangular, $routeParams, $modal) {

  var flowId = $routeParams.id;

  $scope.loading = true;
  $scope.currentTab = 'steps'

  var flowPromise = Restangular.one('flows', flowId).get({'display_type': 'full'});

  flowPromise.then(function(response) {
    $scope.loading = false;

    $scope.flow = response.data;
  });

  $scope.editStep = function () {
    $modal.open({
      templateUrl: 'views/flows/editStep.html',
      windowClass: 'editStepModal'
    });
  };

  $scope.addStep = function () {
    $modal.open({
      templateUrl: 'views/flows/addStep.html',
      windowClass: 'editStepModal',
      resolve: {
        flow: function() {
          return $scope.flow;
        }
      },
      controller: ['$scope', '$modalInstance', 'flow', function($scope, $modalInstance, flow) {
        $scope.flow = {stepType: 'form'};
        $scope.selectedFlow = null;

        $scope.selectFlow = function(flow) {
          $scope.selectedFlow = flow;
        };

        var flowsPromise = Restangular.all('flows').getList();

        flowsPromise.then(function(response) {
          $scope.flows = response.data;
        });

        $scope.save = function() {
          var step;

          if ($scope.flow.stepType === 'form')
          {
            step = {title: $scope.flow.title, step_type: 'form'};
          }
          else
          {
            step = {title: $scope.selectedFlow.title, step_type: 'flow', child_flow_id: $scope.selectedFlow.id};
          }

          var stepPromise = Restangular.one('flows', flow.id).post('steps', step);

          stepPromise.then(function(response) {
            flow.steps.push(Restangular.stripRestangular(response.data));
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
