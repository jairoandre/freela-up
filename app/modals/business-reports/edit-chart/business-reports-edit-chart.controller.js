'use strict';

angular
  .module('BusinessReportsEditChartModalModule', ['ReportCategorySelectorDirectiveModule'])
  .controller('BusinessReportsEditChartModalController', function ($modal, $scope, ReportsCategoriesService, $modalInstance, promise, chart) {
    $scope.chartTypes = [
      { type: 'BarChart', title: 'Barra' },
      { type: 'PieChart', title: 'Pizza' },
      { type: 'AreaChart', title: 'Área' },
      { type: 'LineChart', title: 'Linha' }
    ];

    $scope.chart = chart;

    $scope.select2Options = {
      minimumResultsForSearch: Infinity
    };

    $scope.valid = function(){
      return $scope.chart.categories.length > 0 &&
             $scope.chart.metric &&
             $scope.chart.type;
    };

    $scope.close = function () {
      promise.reject();
      $modalInstance.close();
    };

    $scope.confirm = function(){
      promise.resolve($scope.chart);
      $modalInstance.close();
    };

    $scope.chart.categories = $scope.chart.categories || [];
    $scope.selectCategory = function(category){
      if($scope.chart.categories.indexOf(category) === -1){
        $scope.chart.categories.push(category);
      }
    };

    $scope.removeCategory = function(category) {
      $scope.chart.categories.splice($scope.chart.categories.indexOf(category), 1);
    };
  })
  .factory('BusinessReportsEditChartModalService', function ($modal, $q) {
    return {
      open: function (chart) {
        var deferred = $q.defer();

        $modal.open({
          templateUrl: 'modals/business-reports/edit-chart/business-reports-edit-chart.template.html',
          windowClass: 'businessReportEditChartModal',
          resolve: {
            promise: function () {
              return deferred;
            },

            chart: function() {
              return chart;
            }
          },
          controller: 'BusinessReportsEditChartModalController',
          controllerAs: 'businessReportEditCtrl'
        });

        return deferred.promise;
      }
    }
  });
