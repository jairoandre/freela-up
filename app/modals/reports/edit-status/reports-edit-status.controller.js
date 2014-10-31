'use strict';

angular
  .module('ReportsEditStatusModalControllerModule', [])
  .controller('ReportsEditStatusModalController', function(Restangular, $scope, $modalInstance, category, report) {
    $scope.category = category;
    $scope.report = angular.copy(report);

    $scope.changeStatus = function(statusId) {
      $scope.report.status_id = statusId; // jshint ignore:line
    };

    $scope.save = function() {
      var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).customPUT({ 'status_id': $scope.report.status_id }); // jshint ignore:line

      changeStatusPromise.then(function() {
        report.status_id = $scope.report.status_id; // jshint ignore:line

        $modalInstance.close();
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
