'use strict';

angular
  .module('ReportsCategoriesManageStatusesModalControllerModule', [])
  .controller('ReportsCategoriesManageStatusesModalController', function($scope, $modalInstance, category, updating, categoryId) {
    $scope.category = category;
    $scope.newStatus = {};
    $scope.updating = updating;
    $scope.categoryId = categoryId;
    $scope.updateStatuses = {};

    $scope.createStatus = function() {
      if ($scope.newStatus.title !== '')
      {
        var newStatus = {title: $scope.newStatus.title, color: '#FFFFFF', initial: 'false', final: 'false', active: 'true'};

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
      if (updating)
      {
        for (var x in $scope.updateStatuses) {
          // change category.statuses to acceptable format for the API
          var tempStatus = angular.copy($scope.updateStatuses[x]);

          tempStatus.initial = tempStatus.initial.toString();
          tempStatus.final = tempStatus.final.toString();
          tempStatus.active = tempStatus.active.toString();

          var updateStatusPromise = Restangular.one('reports').one('categories', categoryId).one('statuses', tempStatus.id).customPUT(tempStatus);

          updateStatusPromise.then(function() {
            // all saved
          }); // jshint ignore:line
        }
      }

      $modalInstance.close();
    };
});
