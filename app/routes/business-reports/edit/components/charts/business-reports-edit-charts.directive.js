'use strict';

angular
  .module('BusinessReportsEditChartsDirectiveModule', ['BusinessReportsEditChartDirectiveModule'])
  .directive('businessReportsCharts', function () {
    return {
      restrict: 'E',
      scope: {
        charts: '=', // angular 1.26 does not support optional binding, so this is required
        valid: '=',
        defaultBeginDate: '=',
        defaultEndDate: '=',
        editable: '='
      },
      templateUrl: 'routes/business-reports/edit/components/charts/business-reports-edit-charts.template.html',
      controller: function ($scope) {
        $scope.addChart = function(){
          var chart = {};
          $scope.charts.push(chart);
        };

        $scope.deleteChart = function(chart) {
          $scope.charts.splice($scope.charts.indexOf(chart), 1);
        };

        // Temp. workaround for issues with digest / problem binding the object directly
        $scope.updateChart = function(chart){
          $scope.charts[$scope.charts.indexOf(chart)] = chart;
        };

        if($scope.charts.length < 1) {
          $scope.addChart();
        }
      }
    };
  });
