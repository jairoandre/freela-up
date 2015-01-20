'use strict';

angular
  .module('ReportsShowControllerModule', [
    'MapShowReportComponentModule',
    'ReportsEditStatusModalControllerModule',
    'ReportsEditModalControllerModule'
  ])

  .controller('ReportsShowController', function ($scope, Restangular, $stateParams, $q, $modal, reportResponse, feedbackResponse, categoriesResponse) {
    $scope.report = reportResponse.data;
    $scope.report.status_id = $scope.report.status.id; // jshint ignore:line
    $scope.feedback = feedbackResponse.data;
    var categories = categoriesResponse.data;

    // find category
    var findCategory = function() {
      for (var i = categories.length - 1; i >= 0; i--) {
        if (categories[i].id === $scope.report.category.id)
        {
          return $scope.category = categories[i];
        }

        if (categories[i].subcategories.length !== 0)
        {
          for (var j = categories[i].subcategories.length - 1; j >= 0; j--) {
            if (categories[i].subcategories[j].id === $scope.report.category.id)
            {
              return $scope.category = categories[i].subcategories[j];
            }
          };
        }
      }
    };

    findCategory();

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

    $scope.edit = function () {
      $modal.open({
        templateUrl: 'modals/reports/edit/reports-edit.template.html',
        windowClass: 'editReportModal',
        resolve: {
          report: function() {
            return $scope.report;
          }
        },
        controller: 'ReportsEditModalController'
      });
    };
  });
