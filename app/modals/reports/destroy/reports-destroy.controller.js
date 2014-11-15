'use strict';

angular
  .module('ReportsDestroyModalControllerModule', [])
  .controller('ReportsDestroyModalController', function($scope, Restangular, removeReportFromList, $modalInstance, report) {
    $scope.report = report;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = Restangular.one('reports').one('items', $scope.report.id).remove();

      deletePromise.then(function() {
        $modalInstance.close();
        $scope.showMessage('ok', 'O Relato ' + $scope.report.protocol + ' foi removido com sucesso', 'success', true);

        removeReportFromList($scope.report);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
