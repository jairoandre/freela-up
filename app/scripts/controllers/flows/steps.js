'use strict';

angular.module('zupPainelApp')

.controller('FlowsStepsCtrl', function ($scope, Restangular, $modal, $routeParams, $q) {
  $scope.currentTab = 'form';

  var flowId = $routeParams.flowId, stepId = $routeParams.id;

  $scope.loading = true;
  $scope.currentTab = 'form';

  var flowPromise = Restangular.one('flows', flowId).get();
  var stepPromise = Restangular.one('flows', flowId).one('steps', stepId).get();
  var fieldsPromise = Restangular.one('flows', flowId).one('steps', stepId).all('fields').getList();
  var triggersPromise = Restangular.one('flows', flowId).one('steps', stepId).all('triggers').getList();

  $q.all([flowPromise, stepPromise, fieldsPromise, triggersPromise]).then(function(responses) {
    $scope.loading = false;

    $scope.flow = responses[0].data;
    $scope.step = responses[1].data;
    $scope.fields = responses[2].data;
    $scope.triggers = responses[3].data;

    // debbuging :-D
    console.log(Restangular.stripRestangular($scope.flow));
    console.log(Restangular.stripRestangular($scope.step));
    console.log(Restangular.stripRestangular($scope.fields));
    console.log(Restangular.stripRestangular($scope.triggers));
  });

  $scope.editStep = function () {
    $modal.open({
      templateUrl: 'views/flows/steps/editBasic.html',
      windowClass: 'editStepModal',
      resolve: {
        flow: function() {
          return $scope.flow;
        },

        step: function() {
          return $scope.step;
        }
      },
      controller: ['$scope', '$modalInstance', 'flow', 'step', function($scope, $modalInstance, flow, step) {
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
});
