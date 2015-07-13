'use strict';

angular
  .module('BusinessReportsEditChartDirectiveModule', ['googlechart', 'BusinessReportsEditChartModalModule'])
  .directive('businessReportsChart', function (BusinessReportsEditChartModalService) {
    return {
      restrict: 'E',
      scope: {
        chart: '=', // angular 1.26 does not support optional binding, so this is required
        editable: '=',
        onChartDelete: '&'
      },
      templateUrl: 'routes/business-reports/edit/components/chart/business-reports-edit-chart.template.html',
      controllerAs: 'chartCtrl',
      controller: function ($scope) {
        var chartTypes = ['BarChart', 'AreaChart', 'PieChart'];
        $scope.openConfigureModal = function(){
          BusinessReportsEditChartModalService.open().then(function(){

          });
        };
        $scope.sampleChart = {
          "type": chartTypes[Math.ceil(Math.random() * chartTypes.length) -1],
          "data": {
            "cols": [
              { type: 'string', label: 'Categoria'},
              { type: 'number', label: 'Relatos'}
            ],
            "rows": [
              {
                "c": [ { "v": "Exemplo 1" }, { "v": 250 } ]
              },
              {
                "c": [ { "v": "Exemplo 2" }, { "v": 150 } ]
              },
              {
                "c": [ { "v": "Exemplo 3" }, { "v": 450 } ]
              }
            ]
          }
        }
      }
    };
  });
