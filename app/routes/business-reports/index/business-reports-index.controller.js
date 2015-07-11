'use strict';

angular
  .module('BusinessReportsIndexControllerModule', [
    'BusinessReportsIndexHeaderDirectiveModule',
    'BusinessReportsIndexListDirectiveModule',
    'BusinessReportsServiceModule'
  ])
  .controller('BusinessReportsIndexController', function ($scope, BusinessReportsService) {
    $scope.loadContent = BusinessReportsService.fetchAll;
  });
