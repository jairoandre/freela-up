'use strict';

angular.module('zupPainelApp')

.controller('ReportsCategoriesCtrl', function ($scope, Restangular, $modal) {
  $scope.loading = true;

  var categoriesPromise = Restangular.one('reports').all('categories').getList();

  categoriesPromise.then(function(response) {
    $scope.categories = response.data;

    $scope.loading = false;
  });

  $scope.deleteCategory = function (category) {
    $modal.open({
      templateUrl: 'views/reports/removeCategory.html',
      windowClass: 'removeModal',
      resolve: {
        reportsCategoriesList: function(){
          return $scope.categories;
        }
      },
      controller: ['$scope', '$modalInstance', 'reportsCategoriesList', function($scope, $modalInstance, reportsCategoriesList) {
        $scope.category = category;

        // delete user from server
        $scope.confirm = function() {
          var deletePromise = Restangular.one('reports').one('categories', $scope.category.id).remove();

          deletePromise.then(function() {
            $modalInstance.close();
            $scope.showMessage('ok', 'A categoria de relato foi removida com sucesso', 'success', true);

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
});
