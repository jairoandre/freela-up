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
  });

  $scope.getAncestor = function(stepId) {
    for (var i = $scope.flow.list_tree_steps.length - 1; i >= 0; i--) { // jshint ignore:line
      if ($scope.flow.list_tree_steps[i].step.id === stepId) // jshint ignore:line
      {
        return $scope.flow.list_tree_steps[i]; // jshint ignore:line
      }
    }
  };

  $scope.editStep = function (step) {
    $modal.open({
      templateUrl: 'views/flows/steps/editBasic.html',
      windowClass: 'editStepModal',
      resolve: {
        flow: function() {
          return $scope.flow;
        }
      },
      controller: ['$scope', '$modalInstance', 'flow', function($scope, $modalInstance, flow) {
        $scope.step = angular.copy(step);

        $scope.save = function()
        {
          var putStepPromise = Restangular.one('flows', flow.id).one('steps', step.id).customPUT({title: $scope.step.title});

          putStepPromise.then(function() {
            step.title = $scope.step.title;
            $modalInstance.close();
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
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
        var flowsPromise = Restangular.all('flows').getList();

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
      templateUrl: 'views/inventories/removeCategory.html',
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

});
