'use strict';

angular.module('zupPainelApp')

.controller('ReportsItemCtrl', function ($scope, Restangular, $routeParams, $q, $modal) {
  $scope.loading = true;

  var reportPromise = Restangular.one('reports').one('items', $routeParams.id).get();
  var feedbackPromise = Restangular.one('reports', $routeParams.id).one('feedback').get();
  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  $q.all([reportPromise, categoriesPromise, feedbackPromise]).then(function(responses) {
    $scope.report = responses[0].data;

    $scope.report.status_id = $scope.report.status.id; // jshint ignore:line

    $scope.feedback = responses[2].data;

    // find category
    for (var i = responses[1].data.length - 1; i >= 0; i--) {
      if (responses[1].data[i].id.toString() === $routeParams.categoryId)
      {
        $scope.category = responses[1].data[i];
      }
    }

    $scope.images = [];

    for (var c = $scope.report.images.length - 1; c >= 0; c--) {
      $scope.images.push({versions: $scope.report.images[c]});
    }

    $scope.loading = false;
  });

  $scope.editReportStatus = function (report, category) {
    $modal.open({
      templateUrl: 'views/reports/editReportStatus.html',
      windowClass: 'editStatusModal',
      resolve: {
        report: function() {
          return report;
        },

        category: function() {
          return category;
        }
      },
      controller: ['$scope', '$modalInstance', 'category', 'report', function($scope, $modalInstance, category, report) {
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
      }]
    });
  };
});
