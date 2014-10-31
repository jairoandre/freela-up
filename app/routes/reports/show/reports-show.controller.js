'use strict';

angular
  .module('ReportsShowControllerModule', [
    'ReportsEditStatusModalControllerModule'
  ])

  .controller('ReportsShowController', function ($scope, Restangular, $stateParams, $q, $modal, reportResponse, feedbackResponse, categoriesResponse) {
    $scope.report = reportResponse.data;
    $scope.report.status_id = $scope.report.status.id; // jshint ignore:line
    $scope.feedback = feedbackResponse.data;
    var categories = categoriesResponse.data;

    // find category
    for (var i = categories.length - 1; i >= 0; i--) {
      if (categories[i].id === $scope.report.category.id)
      {
        $scope.category = categories[i];
      }
    }

    $scope.images = [];

    for (var c = $scope.report.images.length - 1; c >= 0; c--) {
      $scope.images.push({versions: $scope.report.images[c]});
    }

    $scope.editReportStatus = function (report, category) {
      $modal.open({
        templateUrl: 'modals/reports/edit-status/reports-edit-status.template.html',
        windowClass: 'editStatusModal',
        resolve: {
          report: function() {
            return report;
          },

          category: function() {
            return category;
          }
        },
        controller: 'ReportsEditStatusModalController'
      });
    };
  });
