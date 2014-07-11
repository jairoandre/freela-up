'use strict';

angular.module('zupPainelApp')

.controller('CasesEditCtrl', function ($scope, Restangular, $modal, $routeParams) {
  var id = $routeParams.id, flowId = $routeParams.flowId;
  $scope.editing = false;

  if (typeof id !== 'undefined')
  {
    $scope.editing = true;
  }

  var flowPromise = Restangular.one('flows', flowId).get({'display_type': 'full'});

  flowPromise.then(function(response) {
    $scope.flow = response.data;

    console.log(Restangular.stripRestangular($scope.flow));
  });

  $scope.selectConductor = function () {
    $modal.open({
      templateUrl: 'views/cases/selectConductor.html',
      windowClass: 'modalConductor'
    });
  };

  $scope.changeConductor = function () {
    $modal.open({
      templateUrl: 'views/cases/changeConductor.html',
      windowClass: 'modalConductor'
    });
  };
});
