'use strict';

angular
  .module('ReportsCategoriesNotificationsListStatusesModalControllerModule', [
    'ReportStatusComponentModule'
  ])

  .controller('ReportsCategoriesNotificationsListStatusesModalController', function($scope, $modalInstance, reportCategoriesNotificationsStatuses, updating, categoryId, Restangular) {
    $scope.reportCategoriesNotificationsStatuses = angular.copy(reportCategoriesNotificationsStatuses);
    $scope.newStatus = {};
    $scope.updating = updating;
    $scope.categoryId = categoryId;
    $scope.updateStatuses = {};

    $scope.availableColors = ['#59B1DF', '#7DDCE2', '#64D2AF', '#5CB466', '#99C450', '#EACD31', '#F3AC2E', '#F18058', '#EF4D3E', '#E984FC', '#A37FE1', '#7A7AF2'];

    $scope.createStatus = function() {
      if ($scope.newStatus.title !== '')
      {
        var newStatus = {
          title: $scope.newStatus.title, color: '#FFFFFF', initial: 'false', final: 'false', active: 'true', private: 'false'
        };

        if (updating)
        {
          var newStatusPromise = Restangular.one('reports').one('categories', categoryId).post('statuses', newStatus);

          newStatusPromise.then(function(response) {
            $scope.category.statuses.push(Restangular.stripRestangular(response.data));

            $scope.newStatus.title = '';
          });
        }
        else
        {
          $scope.category.statuses.push(newStatus);

          $scope.newStatus.title = '';
        }
      }
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
