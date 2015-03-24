'use strict';

angular
  .module('FlowsIndexControllerModule', [
    'FlowsAddModalControllerModule',
    'FlowsEditModalControllerModule',
    'FlowsDestroyModalControllerModule'
  ])

  .controller('FlowsIndexController', function ($scope, Restangular, $modal) {

    $scope.loading = true;

    var flowsPromise = Restangular.all('flows').getList({'display_type': 'full', 'return_fields': [
      'id', 'title', 'total_cases',
      'created_by.id', 'created_by.name',
      'updated_by.id', 'updated_by.name',
      'steps.id'
    ].join()});

    flowsPromise.then(function(response) {
      $scope.loading = false;

      $scope.flows = response.data;
    });

    $scope.addFlow = function () {
      $modal.open({
        templateUrl: 'modals/flows/add/flows-add.template.html',
        windowClass: 'addFlowModal',
        resolve: {
          flows: function() {
            return $scope.flows;
          }
        },
        controller: 'FlowsAddModalController'
      });
    };

    $scope.editFlow = function (flow) {
      $modal.open({
        templateUrl: 'modals/flows/edit/flows-edit.template.html',
        windowClass: 'addFlowModal',
        resolve: {
          flows: function() {
            return $scope.flows;
          },

          flow: function() {
            return flow;
          }
        },
        controller: 'FlowsEditModalController'
      });
    };

    $scope.removeFlow = function (flow) {
      $modal.open({
        templateUrl: 'modals/flows/destroy/flows-destroy.template.html',
        windowClass: 'removeModal',
        resolve: {
          flows: function() {
            return $scope.flows;
          },

          flow: function() {
            return flow;
          }
        },
        controller: 'FlowsDestroyModalController'
      });
    };
  });
