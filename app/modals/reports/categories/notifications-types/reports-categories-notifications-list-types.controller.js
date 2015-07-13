'use strict';

angular
  .module('ReportsCategoriesNotificationsListTypesModalControllerModule', [
    'ReportStatusComponentModule'
  ])

  .controller('ReportsCategoriesNotificationsListTypesModalController', function($scope, $modalInstance, $state, reportCategoriesNotificationsTypes, updating, categoryId, parentState, Restangular) {
    $scope.reportCategoriesNotificationsTypes = angular.copy(reportCategoriesNotificationsTypes);
    $scope.newStatus = {};
    $scope.updating = updating;
    $scope.categoryId = categoryId;
    $scope.updateStatuses = {};

    $scope.availableColors = ['#59B1DF', '#7DDCE2', '#64D2AF', '#5CB466', '#99C450', '#EACD31', '#F3AC2E', '#F18058', '#EF4D3E', '#E984FC', '#A37FE1', '#7A7AF2'];

    $scope.createNotificationType = function() {

      parentState.go('reports.categories.notifications.add', {categoryId: $scope.categoryId}, {reload: true});

      $modalInstance.close();

    };

    $scope.editNotificationType = function(notificationType) {

      parentState.go('reports.categories.notifications.edit', {id: notificationType.id, categoryId: $scope.categoryId}, {reload: true});

      $modalInstance.close();

    };

    $scope.changeInitial = function(status) {
      for (var i = $scope.category.statuses.length - 1; i >= 0; i--) {
        if (status !== $scope.category.statuses[i])
        {
          $scope.category.statuses[i].initial = false;
        }
      }

      // force change if user clicks on same checkbox
      status.initial = true;
    };

    $scope.removeStatus = function(status) {
      if (typeof status.id !== 'undefined')
      {
        var deletePromise = Restangular.one('reports').one('categories', categoryId).one('statuses', status.id).remove();

        deletePromise.then(function() {
          $scope.category.statuses.splice($scope.category.statuses.indexOf(status), 1);
        });
      }
      else
      {
        $scope.category.statuses.splice($scope.category.statuses.indexOf(status), 1);
      }
    };

    $scope.close = function() {
      $modalInstance.close();
    };
});
