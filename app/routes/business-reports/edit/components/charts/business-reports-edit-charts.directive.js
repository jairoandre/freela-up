'use strict';

angular
  .module('BusinessReportsEditChartsDirectiveModule', [])
  .directive('businessReportsCharts', function(){
    return {
      restrict: 'E',
      scope: {
        charts: '@',
        valid: '='
      },
      templateUrl: 'routes/business-reports/edit/components/charts/business-reports-edit-charts.template.html',
      controller: function($scope) {

      }
    };
  });
