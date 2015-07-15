'use strict';

angular
  .module('BusinessReportsEditControllerModule', [
    'BusinessReportsEditHeaderDirectiveModule',
    'BusinessReportsEditFormDirectiveModule',
    'BusinessReportsEditChartsDirectiveModule',
    'BusinessReportsServiceModule'
  ])
  .controller('BusinessReportsEditController', function ($scope, BusinessReportsService, report) {
    $scope.report = report;

    $scope.$watch('report.title', function(value){
      $scope.valid = value && value.length > 0;
    });

    $scope.saveBusinessReport = function(){
      BusinessReportsService.save($scope.report);
    };
  });
