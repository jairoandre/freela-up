'use strict';

angular
  .module('BusinessReportsEditChartModalModule', ['ReportCategorySelectorDirectiveModule'])
  .controller('BusinessReportsEditChartModalController', function ($modal, $scope, ReportsCategoriesService, $modalInstance, promise, $log) {

    $log.info('ReportsDestroyModalController created.');

    $scope.$on("$destroy", function () {
      $log.info('ReportsDestroyModalController destroyed.');
    });

    $scope.close = function () {
      $modalInstance.close();
    };
  })
  .factory('BusinessReportsEditChartModalService', function ($modal, $q) {
    return {
      open: function () {
        var deferred = $q.defer();

        $modal.open({
          templateUrl: 'modals/business-reports/edit-chart/business-reports-edit-chart.template.html',
          windowClass: 'businessReportEditChartModal',
          resolve: {
            promise: function () {
              return deferred;
            }
          },
          controller: 'BusinessReportsEditChartModalController'
        });

        return deferred.promise;
      }
    }
  });
