'use strict';

angular
  .module('BusinessReportsEditControllerModule', [
    'BusinessReportsEditHeaderDirectiveModule',
    'BusinessReportsEditFormDirectiveModule',
    'BusinessReportsEditChartsDirectiveModule',
    'BusinessReportsServiceModule'
  ])
  .controller('BusinessReportsEditController', function ($scope, BusinessReportsService) {
    $scope.report = { charts: [] };

    $scope.$watch('report.title', function(value){
      $scope.valid = value && value.length > 0;
    });
  });
