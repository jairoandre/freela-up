'use strict';

angular.module('zupPainelApp')

.controller('FlowsViewCtrl', function ($scope, Restangular, $routeParams, $modal, $q) {

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

        var flowsAncestorsPromise = Restangular.one('flows', flow.id).all('ancestors').getList();
        var flowsPromise = Restangular.all('flows').getList();

        $q.all([flowsPromise, flowsAncestorsPromise]).then(function(responses) {
          $scope.flows = responses[0].data;
          var ancestors = responses[1].data;

          for (var i = $scope.flows.length - 1; i >= 0; i--) {
            if (ancestors.indexOf($scope.flows[i].id) !== -1)
            {
              $scope.flows[i].hidden = true;
            }
          };
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
