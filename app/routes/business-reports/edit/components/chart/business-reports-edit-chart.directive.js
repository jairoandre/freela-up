'use strict';

angular
  .module('BusinessReportsEditChartDirectiveModule', [
    'googlechart',
    'BusinessReportsEditChartModalModule',
    'PeriodSelectorModule'
  ])
  .directive('businessReportsChart', function (BusinessReportsEditChartModalService, PeriodSelectorService) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=', // angular 1.26 does not support optional binding, so this is required
        editable: '=',
        onChartDelete: '&',
        defaultBeginDate: '=',
        defaultEndDate: '='
      },
      templateUrl: 'routes/business-reports/edit/components/chart/business-reports-edit-chart.template.html',
      controllerAs: 'chartCtrl',
      controller: function ($scope) {
        // used to decide wether or not to update the period based on the default*Date updates
        $scope.hasSelectedDate = false;
        var chartTypes = ['BarChart', 'AreaChart', 'PieChart', 'LineChart'];
        var sampleChart = {
          "period": {},
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

        if (!$scope.chartData.id) {
          $scope.chart = sampleChart;
        } else {
          $scope.chart = $scope.chartData;
        }

        if (!$scope.chart.period.begin_date || !$scope.chart.period.end_date) {
          $scope.chart.period.begin_date = $scope.defaultBeginDate;
          $scope.chart.period.end_date = $scope.defaultEndDate;
        }

        $scope.openConfigureModal = function () {
          var copy = angular.copy($scope.chart);
          BusinessReportsEditChartModalService.open(copy).then(function (chart) {
            $scope.chart = chart;
          });
        };

        $scope.selectPeriod = function () {
          PeriodSelectorService.open(false).then(function (period) {
            $scope.chart.period.begin_date = period.beginDate;
            $scope.chart.period.end_date = period.endDate;
            $scope.hasSelectedDate = true;
          });
        };

        $scope.$watch('chart.categories', function (categories) {
          if (!categories) return;
          $scope.chart.data.rows = _.map(categories, function (c) {
            return {
              c: [{v: c.title}, {v: Math.ceil(Math.random() * 1000)}]
            };
          });
        });

        $scope.$watch('defaultBeginDate', function (v) {
          if (!$scope.hasSelectedDate)
            $scope.chart.period.begin_date = v;
        });

        $scope.$watch('defaultEndDate', function (v) {
          if (!$scope.hasSelectedDate)
            $scope.chart.period.end_date = v;
        })
      }
    };
  });
