'use strict';

angular
  .module('CasesEditControllerModule', [])

  .controller('CasesEditController', function ($scope, Restangular, $modal, $stateParams) {
    var id = $stateParams.id;

    $scope.loading = true;
    $scope.currentTab = 'steps';

    var casePromise = Restangular.one('cases', id).get({'display_type': 'full'});

    casePromise.then(function(response) {
      $scope.case = response.data;

      $scope.loading = false;

      console.log(Restangular.stripRestangular($scope.case));
    });

    $scope.toggleTree = function() {
      if ($scope.viewTree === true)
      {
        $scope.viewTree = false;
      }
      else
      {
        $scope.viewTree = true;
      }
    };

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
