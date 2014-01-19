'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, Reports) {

  $scope.loading = true;

  // Get all reports categories
  Reports.getAllCategories(function(data) {
    $scope.categories = data.categories;

    $scope.loading = false;
  });
})

.controller('ViewItemsReportsCtrl', function ($scope, Reports, $routeParams) {

  $scope.loading = true;

  // Get reports from a specific category
  Reports.getItemsByCategory({ categoryId: $routeParams.categoryId }, function(data) {
    $scope.reports = data.reports;

    $scope.loading = false;
  });

});
