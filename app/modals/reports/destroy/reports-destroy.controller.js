'use strict';

angular
  .module('ReportsDestroyModalControllerModule', ['ReportsItemsServiceModule'])
  .controller('ReportsDestroyModalController', function($scope, Restangular, ReportsItemsService, $modalInstance, report) {
    $scope.report = report;

    // delete user from server
    $scope.confirm = function() {
      var deletePromise = ReportsItemsService.remove($scope.report.id);

      deletePromise.then(function() {
        $modalInstance.close();
        $scope.showMessage('ok', 'O Relato ' + $scope.report.protocol + ' foi removido com sucesso', 'success', true);
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
