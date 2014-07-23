'use strict';

angular.module('zupPainelApp')

.controller('CasesEditCtrl', function ($scope, Restangular, $modal, $routeParams) {
  var id = $routeParams.id, flowId = $routeParams.flowId;

  var casePromise = Restangular.one('cases', id).get({'display_type': 'full'});

  casePromise.then(function(response) {
    $scope.case = response.data;

    console.log(Restangular.stripRestangular($scope.case));
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
