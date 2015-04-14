'use strict';

angular
  .module('ReportsEditStatusModalControllerModule', [])

  .controller('ReportsEditStatusModalController', function(Restangular, $scope, $state, $modalInstance, category, report) {
    $scope.category = category;
    $scope.report = angular.copy(report);

    $scope.changeStatus = function(statusId) {
      $scope.report.status_id = statusId; // jshint ignore:line
    };

    $scope.save = function() {
      $scope.processing = true;

      var visibility = 0;

      if ($scope.report.privateComment) visibility = 1;

      var changeStatusPromise = Restangular.one('reports', $scope.category.id).one('items', $scope.report.id).one('update_status').customPUT({ 'status_id': $scope.report.status_id, 'comment': $scope.report.comment, 'comment_visibility': visibility }); // jshint ignore:line

      changeStatusPromise.then(function() {
        report.status_id = $scope.report.status_id; // jshint ignore:line

        $scope.processing = false;

        $modalInstance.close();

        $scope.showMessage('ok', 'O estado do relato foi alterado com sucesso.', 'success', true);
        $state.go($state.current, {}, {reload: true});
      });
    };

    $scope.close = function() {
      $modalInstance.close();
    };
  });
