'use strict';

angular.module('zupPainelApp')

.controller('ReportsCtrl', function ($scope, $modal, Reports) {

  $scope.loading = true;

  // Get all reports categories
  Reports.get(function(data) {
    $scope.categories = data.categories;

    $scope.loading = false;
  });

  $scope.deleteCategory = function (category) {
    $modal.open({
      templateUrl: 'removeCategory.html',
      windowClass: 'removeModal',
      resolve: {
        reportsCategoriesList: function(){
          return $scope.categories;
        }
      },
      controller: ['$scope', '$modalInstance', 'Users', 'reportsCategoriesList', function($scope, $modalInstance, Users, reportsCategoriesList) {
        $scope.category = category;

        // delete user from server
        $scope.confirm = function() {
          Reports.delete({ id: $scope.category.id }, function() {
            $modalInstance.close();

            // remove user from list
            reportsCategoriesList.splice(reportsCategoriesList.indexOf($scope.category), 1);
          });
        };

        $scope.close = function() {
          $modalInstance.close();
        };
      }]
    });
  };
})

.controller('ViewItemsReportsCtrl', function ($scope, Reports, $routeParams) {

  $scope.loading = true;

  // Get reports from a specific category
  Reports.getItemsByCategory({ categoryId: $routeParams.categoryId }, function(data) {
    $scope.reports = data.reports;

    $scope.loading = false;
  });

});
