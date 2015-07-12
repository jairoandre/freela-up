'use strict';

angular
  .module('BusinessReportsEditControllerModule', [
    'BusinessReportsEditHeaderDirectiveModule',
    'BusinessReportsEditFormDirectiveModule',
    'BusinessReportsEditChartsDirectiveModule',
    'BusinessReportsServiceModule'
  ])
  .controller('BusinessReportsEditController', function ($scope, BusinessReportsService) {
    $scope.report = {};
  });
