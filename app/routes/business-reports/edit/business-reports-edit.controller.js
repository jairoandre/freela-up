'use strict';

angular
  .module('BusinessReportsEditControllerModule', [
    'BusinessReportsEditHeaderDirectiveModule',
    'BusinessReportsEditFormDirectiveModule',
    'BusinessReportsEditChartsDirectiveModule',
    'BusinessReportsServiceModule'
  ])
  .controller('BusinessReportsEditController', function ($scope, BusinessReportsService, report, editable) {
    $scope.report = report;
    $scope.editable = editable;

    $scope.$watch('report.title', function(value){
      $scope.valid = value && value.length > 0;
    });

    $scope.saveBusinessReport = function(){
      BusinessReportsService.save($scope.report);
    };
  });
