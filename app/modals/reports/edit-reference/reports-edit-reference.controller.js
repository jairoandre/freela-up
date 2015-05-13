'use strict';

angular
  .module('ReportsEditReferenceModalControllerModule', [])

  .controller('ReportsEditReferenceModalController', function(Restangular, $scope, $modalInstance, report) {
    $scope.report = angular.copy(report);

    $scope.save = function() {
      $scope.processingForm = true;

      var postUserPromise = Restangular.one('reports', report.category.id).one('items', report.id).customPUT({
        reference: $scope.report.reference,
        return_fields: 'reference'
      });

      postUserPromise.then(function(response) {
        $modalInstance.close();

        $scope.processingForm = false;

        report.reference = $scope.report.reference;
      }, function(response) {
        $scope.processingForm = false;
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
