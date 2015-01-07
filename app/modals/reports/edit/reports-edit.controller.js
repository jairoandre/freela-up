'use strict';

angular
  .module('ReportsEditModalControllerModule', [])
  .controller('ReportsEditModalController', function(Restangular, $scope, $modalInstance, report) {
    $scope.report = angular.copy(report);

    $scope.save = function() {
      $scope.processingForm = true;

      var postUserPromise = Restangular.one('reports', report.category.id).one('items', report.id).customPUT({ description: $scope.report.description, address: $scope.report.address });

      postUserPromise.then(function(response) {
        $modalInstance.close();

        $scope.processingForm = false;

        report.address = $scope.report.address;
        report.description = $scope.report.description;
      }, function(response) {
        $scope.processingForm = false;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
