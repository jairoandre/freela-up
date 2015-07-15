'use strict';

angular
  .module('BusinessReportsEditChartDirectiveModule', ['googlechart', 'BusinessReportsEditChartModalModule'])
  .directive('businessReportsChart', function (BusinessReportsEditChartModalService, $log) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=', // angular 1.26 does not support optional binding, so this is required
        editable: '=',
        onChartDelete: '&'
      },
      templateUrl: 'routes/business-reports/edit/components/chart/business-reports-edit-chart.template.html',
      controllerAs: 'chartCtrl',
      controller: function ($scope) {
        var chartTypes = ['BarChart', 'AreaChart', 'PieChart', 'LineChart'];
        var sampleChart = {
          "type": chartTypes[Math.ceil(Math.random() * chartTypes.length) - 1],
          "data": {
            "cols": [
              {type: 'string', label: 'Categoria'},
              {type: 'number', label: 'Relatos'}
            ],
            "rows": [
              {
                "c": [{"v": "Exemplo 1"}, {"v": 250}]
              },
              {
                "c": [{"v": "Exemplo 2"}, {"v": 150}]
              },
              {
                "c": [{"v": "Exemplo 3"}, {"v": 450}]
              }
            ]
          }
        };

        if(!$scope.chartData.id) {
          $scope.chart = sampleChart;
        } else {
          $scope.chart = $scope.chartData;
        }

        $scope.openConfigureModal = function () {
          var copy = angular.copy($scope.chart);
          BusinessReportsEditChartModalService.open(copy).then(function(chart){
            $scope.chart = chart;
          });
        };

        $scope.$watch('chart.categories', function(categories){
          if(!categories) return;
          $scope.chart.data.rows = _.map(categories, function (c) {
            return {
              c: [{v: c.title}, {v: Math.ceil(Math.random() * 1000)}]
            };
          });
        });

        $scope.$watch('chart', function(newVal, oldVal){
          var a = 10;
        })
      }
    };
  });
