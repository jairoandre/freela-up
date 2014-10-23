'use strict';

angular.module('zupPainelApp')

.controller('FlowsViewCtrl', function ($scope, Restangular, $routeParams, $modal, $q) {

  var flowId = $routeParams.id;

  $scope.loading = true;
  $scope.currentTab = 'steps';

  var flowPromise = Restangular.one('flows', flowId).get({'display_type': 'full'});

  flowPromise.then(function(response) {
    $scope.loading = false;

    $scope.flow = response.data;

    console.log(Restangular.stripRestangular($scope.flow));
  });

  $scope.getAncestor = function(stepId) {
    for (var i = $scope.flow.steps.length - 1; i >= 0; i--) { // jshint ignore:line
      if ($scope.flow.steps[i].id === stepId) // jshint ignore:line
      {
        return $scope.flow.steps[i]; // jshint ignore:line
      }
    }
  };

  $scope.addStep = function () {
    $modal.open({
      templateUrl: 'views/flows/steps/add.html',
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
        var flowsPromise = Restangular.all('flows').getList({'display_type': 'full'});

        $q.all([flowsPromise, flowsAncestorsPromise]).then(function(responses) {
          $scope.flows = responses[0].data;
          var ancestors = responses[1].data;

          for (var i = $scope.flows.length - 1; i >= 0; i--) {
            if (ancestors.indexOf($scope.flows[i].id) !== -1)
            {
              $scope.flows[i].hidden = true;
            }
          }
        });

        $scope.save = function() {
          var step;

          if ($scope.flow.stepType === 'form')
          {
            step = {title: $scope.flow.title, step_type: 'form'}; // jshint ignore:line
          }
          else
          {
            step = {title: $scope.selectedFlow.title, step_type: 'flow', child_flow_id: $scope.selectedFlow.id}; // jshint ignore:line
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

  $scope.removeStep = function (step) {
    $modal.open({
      templateUrl: 'views/flows/steps/remove.html',
      windowClass: 'removeModal',
      resolve: {
        flow: function() {
          return $scope.flow;
        }
      },
      controller: ['$scope', '$modalInstance', 'flow', function($scope, $modalInstance, flow) {
        $scope.step = step;

        // delete user from server
        $scope.confirm = function() {
          var deletePromise = Restangular.one('flows', flow.id).one('steps', step.id).remove();

          deletePromise.then(function() {
            $modalInstance.close();

            // remove user from list
            flow.steps.splice(flow.steps.indexOf($scope.step), 1);
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };

  $scope.editFlow = function () {
    $modal.open({
      templateUrl: 'views/flows/edit.html',
      windowClass: 'addFlowModal',
      resolve: {
        flow: function() {
          return $scope.flow;
        }
      },
      controller: ['$scope', '$modalInstance', 'flow', function($scope, $modalInstance, flow) {
        $scope.flow = flow;
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
