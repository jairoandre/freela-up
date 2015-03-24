'use strict';

angular
  .module('FlowsShowControllerModule', [
    'FlowsStepsAddModalControllerModule',
    'FlowsStepsDestroyModalControllerModule',
    'FlowsStepsOrderComponentModule'
  ])

  .controller('FlowsShowController', function ($scope, Restangular, $stateParams, $modal, $q) {

    var flowId = $stateParams.id;

    $scope.loading = true;
    $scope.currentTab = 'steps';

    var flowPromise = Restangular.one('flows', flowId).get({'display_type': 'full', 'return_fields': [
      'id', 'title',
      'my_steps_flows.id', 'my_steps_flows.title', 'my_steps_flows.step_type',
      'my_steps_flows.my_child_flow.id', 'my_steps_flows.my_child_flow.title', 'my_steps_flows.my_child_flow.step_type'
    ].join()});

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
        templateUrl: 'modals/flows/steps/add/flows-steps-add.template.html',
        windowClass: 'editStepModal',
        resolve: {
          flow: function() {
            return $scope.flow;
          }
        },
        controller: 'FlowsStepsAddModalController'
      });
    };

    $scope.removeStep = function (step) {
      $modal.open({
        templateUrl: 'modals/flows/steps/destroy/flows-steps-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          flow: function() {
            return $scope.flow;
          },

          step: function() {
            return step;
          }
        },
        controller: 'FlowsStepsDestroyModalController'
      });
    };

    $scope.editFlow = function () {
      $modal.open({
        templateUrl: 'modals/flows/edit/flows-edit.template.html',
        windowClass: 'addFlowModal',
        resolve: {
          flows: function() {
            return null;
          },

          flow: function() {
            return $scope.flow;
          }
        },
        controller: 'FlowsEditModalController'
      });
    };

  });
